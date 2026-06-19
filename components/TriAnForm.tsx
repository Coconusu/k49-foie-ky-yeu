"use client";

import { useRef, useState } from "react";
import SignaturePad, { type SignaturePadHandle } from "@/components/SignaturePad";
import { submitTribute } from "@/lib/tributes";

const MESSAGE_LIMIT = 300;
const COOLDOWN_MS = 5 * 60 * 1000;
const STORAGE_KEY = "loiTriAn:lastSubmittedAt";

export default function TriAnForm() {
  const signatureRef = useRef<SignaturePadHandle>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [hasSignature, setHasSignature] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const canSubmit =
    name.trim().length > 0 &&
    message.trim().length > 0 &&
    message.length <= MESSAGE_LIMIT &&
    hasSignature &&
    !isSubmitting;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || !signatureRef.current) return;
    if (honeypot) return;

    const lastSubmittedAt = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    if (Date.now() - lastSubmittedAt < COOLDOWN_MS) {
      setErrorText("Bạn vừa gửi lời tri ân, hãy đợi vài phút rồi gửi tiếp nhé.");
      return;
    }

    setIsSubmitting(true);
    setErrorText("");
    try {
      await submitTribute({
        name,
        message,
        signature: signatureRef.current.toDataURL(),
      });
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
      setName("");
      setMessage("");
      signatureRef.current.clear();
    } catch {
      setErrorText("Gửi không thành công, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass mx-auto flex max-w-xl flex-col gap-4 rounded-3xl p-6"
    >
      <div>
        <label className="mb-2 block font-be-vietnam text-sm text-white/80">
          Chữ ký
        </label>
        <SignaturePad ref={signatureRef} onChangeEmpty={(empty) => setHasSignature(!empty)} />
        <button
          type="button"
          onClick={() => signatureRef.current?.clear()}
          className="mt-2 font-be-vietnam text-xs text-blue-light underline"
        >
          Xoá ký lại
        </button>
      </div>

      <div>
        <label className="mb-1 block font-be-vietnam text-sm text-white/80" htmlFor="tri-an-name">
          Tên của bạn
        </label>
        <input
          id="tri-an-name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-be-vietnam text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-light"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="font-be-vietnam text-sm text-white/80" htmlFor="tri-an-message">
            Lời tri ân
          </label>
          <span className="font-be-vietnam text-xs text-white/50">
            {MESSAGE_LIMIT - message.length} ký tự còn lại
          </span>
        </div>
        <textarea
          id="tri-an-message"
          required
          value={message}
          maxLength={MESSAGE_LIMIT}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-be-vietnam text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-light"
          placeholder="Gửi lời cảm ơn, kỷ niệm đáng nhớ..."
        />
      </div>

      <input
        type="text"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {errorText && (
        <p className="font-be-vietnam text-sm text-red-300">{errorText}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-full bg-blue-light px-6 py-3 font-be-vietnam font-semibold text-navy-deep transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? "Đang gửi..." : "Gửi lời tri ân"}
      </button>
    </form>
  );
}
