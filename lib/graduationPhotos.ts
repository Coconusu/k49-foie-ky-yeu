import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

const COLLECTION = "graduationPhotos";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export function isAcceptedGraduationPhoto(file: File): boolean {
  if (file.size > MAX_FILE_SIZE) return false;
  if (ACCEPTED_MIME.has(file.type)) return true;
  // Một số thiết bị (đặc biệt Android) không gắn đúng MIME type cho HEIC/HEIF
  return /\.(heic|heif)$/i.test(file.name);
}

function isHeic(file: File): boolean {
  return file.type === "image/heic" || file.type === "image/heif" || /\.(heic|heif)$/i.test(file.name);
}

export type UploadableBlob = { blob: Blob; extension: string; contentType: string };

// HEIC không hiển thị được trên hầu hết trình duyệt ngoài Safari/iOS, nên
// convert sang JPEG ngay tại client trước khi đưa vào hàng đợi chờ upload.
// Nếu convert lỗi, fallback giữ nguyên file gốc để KHÔNG làm mất ảnh thật
// (ảnh vẫn được lưu lên Storage, chỉ là có thể không hiển thị trên mọi máy).
export async function convertToUploadable(file: File): Promise<UploadableBlob> {
  if (!isHeic(file)) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    return { blob: file, extension, contentType: file.type || "image/jpeg" };
  }

  try {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.82 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    return { blob, extension: "jpg", contentType: "image/jpeg" };
  } catch {
    return { blob: file, extension: "heic", contentType: file.type || "image/heic" };
  }
}

export async function uploadBlobToGraduation(
  blob: Blob,
  extension: string,
  contentType: string,
  senderName: string | null,
): Promise<void> {
  const storagePath = `graduation/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, blob, { contentType });
  const imageUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, COLLECTION), {
    imageUrl,
    storagePath,
    senderName,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function fetchApprovedGraduationPhotos(): Promise<string[]> {
  const approvedQuery = query(collection(db, COLLECTION), where("status", "==", "approved"));
  const snapshot = await getDocs(approvedQuery);
  return snapshot.docs
    .map((doc) => doc.data().imageUrl)
    .filter((url): url is string => typeof url === "string");
}
