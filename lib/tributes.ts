import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Tribute = {
  id: string;
  name: string;
  message: string;
  signature: string;
};

const COLLECTION = "tributes";
const MAX_TRIBUTES = 300;

export function subscribeTributes(onChange: (tributes: Tribute[]) => void) {
  const tributesQuery = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc"),
    limit(MAX_TRIBUTES),
  );

  return onSnapshot(
    tributesQuery,
    (snapshot) => {
      onChange(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: typeof data.name === "string" ? data.name : "",
            message: typeof data.message === "string" ? data.message : "",
            signature: typeof data.signature === "string" ? data.signature : "",
          };
        }),
      );
    },
    (error) => {
      console.error("Không thể tải Bức tường tri ân:", error);
      onChange([]);
    },
  );
}

export async function submitTribute(input: {
  name: string;
  message: string;
  signature: string;
}) {
  await addDoc(collection(db, COLLECTION), {
    name: input.name.trim().slice(0, 80),
    message: input.message.trim().slice(0, 300),
    signature: input.signature,
    createdAt: serverTimestamp(),
  });
}
