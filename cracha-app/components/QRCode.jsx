"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QRCode2({ value, size = 180 }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then(setSrc)
      .catch(() => setSrc(null));
  }, [value, size]);

  if (!src) {
    return (
      <div
        className="animate-pulse rounded bg-slate-200"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt="QR code do crachá"
      className="rounded"
    />
  );
}
