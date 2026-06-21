import { uploadBlobToGraduation } from "@/lib/graduationPhotos";

// Hàng đợi upload ảnh Tốt nghiệp lưu THẬT trong IndexedDB của trình duyệt,
// để ảnh không bị mất nếu Storage đang lỗi hoặc mất mạng khi gửi. Ảnh chỉ
// được xoá khỏi hàng đợi sau khi upload lên Firebase Storage THÀNH CÔNG.
const DB_NAME = "k49-foie-graduation-queue";
const DB_VERSION = 1;
const STORE_NAME = "uploads";
export const MAX_ATTEMPTS = 5;
const RETRY_INTERVAL_MS = 20000;

export type QueueStatus = "pending" | "uploading" | "failed";

export type QueueItem = {
  id: string;
  blob: Blob;
  extension: string;
  contentType: string;
  senderName: string | null;
  status: QueueStatus;
  attempts: number;
  lastError: string | null;
  createdAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putItem(item: QueueItem): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllQueueItems(): Promise<QueueItem[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result as QueueItem[]);
    req.onerror = () => reject(req.error);
  });
}

export async function removeFromQueue(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  notifyListeners();
}

export async function addToQueue(input: {
  blob: Blob;
  extension: string;
  contentType: string;
  senderName: string | null;
}): Promise<string> {
  const id = crypto.randomUUID();
  await putItem({
    id,
    status: "pending",
    attempts: 0,
    lastError: null,
    createdAt: Date.now(),
    ...input,
  });
  notifyListeners();
  return id;
}

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeQueue(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

const UPLOAD_TIMEOUT_MS = 15000;

// Khi Storage đang lỗi/treo (không reject nhanh), request upload có thể
// không bao giờ resolve/reject -> tự thêm timeout để item không bị kẹt mãi
// ở trạng thái "uploading" và vòng tự thử lại vẫn tiếp tục hoạt động.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Quá thời gian chờ phản hồi từ máy chủ")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function attemptUpload(item: QueueItem): Promise<void> {
  await putItem({ ...item, status: "uploading" });
  notifyListeners();

  try {
    await withTimeout(
      uploadBlobToGraduation(item.blob, item.extension, item.contentType, item.senderName),
      UPLOAD_TIMEOUT_MS,
    );
    await removeFromQueue(item.id);
  } catch (error) {
    const attempts = item.attempts + 1;
    await putItem({
      ...item,
      attempts,
      status: attempts >= MAX_ATTEMPTS ? "failed" : "pending",
      lastError: error instanceof Error ? error.message : "Lỗi không xác định",
    });
    notifyListeners();
  }
}

// Tự động thử lại các ảnh chưa upload được. Ảnh đã "failed" (hết số lần thử
// tự động) chỉ được gửi lại khi người dùng bấm "Thử lại" (xem retryItem).
export async function processQueue(): Promise<void> {
  const items = await getAllQueueItems();
  for (const item of items) {
    if (item.status === "uploading") continue;
    if (item.status === "failed" && item.attempts >= MAX_ATTEMPTS) continue;
    await attemptUpload(item);
  }
}

export async function retryItem(id: string): Promise<void> {
  const items = await getAllQueueItems();
  const item = items.find((current) => current.id === id);
  if (item) await attemptUpload(item);
}

export function startBackgroundRetry(): () => void {
  processQueue();

  const onOnline = () => processQueue();
  window.addEventListener("online", onOnline);
  const intervalId = setInterval(processQueue, RETRY_INTERVAL_MS);

  return () => {
    clearInterval(intervalId);
    window.removeEventListener("online", onOnline);
  };
}
