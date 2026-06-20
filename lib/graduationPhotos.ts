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

// HEIC không hiển thị được trên hầu hết trình duyệt ngoài Safari/iOS, nên
// convert sang JPEG ngay tại client trước khi upload để hiển thị được mọi nơi.
async function toUploadableBlob(file: File): Promise<{ blob: Blob; extension: string }> {
  if (!isHeic(file)) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    return { blob: file, extension };
  }

  const heic2any = (await import("heic2any")).default;
  const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.82 });
  const blob = Array.isArray(converted) ? converted[0] : converted;
  return { blob, extension: "jpg" };
}

export async function uploadGraduationPhoto(file: File, senderName: string): Promise<void> {
  const { blob, extension } = await toUploadableBlob(file);
  const storagePath = `graduation/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, blob, { contentType: extension === "jpg" ? "image/jpeg" : file.type });
  const imageUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, COLLECTION), {
    imageUrl,
    storagePath,
    senderName: senderName.trim().slice(0, 80) || null,
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
