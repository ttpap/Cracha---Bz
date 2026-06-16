"use client";

import { useState } from "react";

export default function Foto({ src, nome = "", size = 56, className = "" }) {
  const [erro, setErro] = useState(false);
  const ini = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  if (!src || erro) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-brand/10 font-bold text-brand ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.36 }}
      >
        {ini || "?"}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={nome}
      width={size}
      height={size}
      onError={() => setErro(true)}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
