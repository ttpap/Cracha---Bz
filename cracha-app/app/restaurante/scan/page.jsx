"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function extrairToken(texto) {
  try {
    const u = new URL(texto);
    const parts = u.pathname.split("/").filter(Boolean);
    const i = parts.indexOf("r");
    if (i >= 0 && parts[i + 1]) return parts[i + 1];
    return parts[parts.length - 1] || texto;
  } catch {
    return texto.trim();
  }
}

export default function ScanPage() {
  const router = useRouter();
  const [erro, setErro] = useState(null);
  const [lendo, setLendo] = useState(true);
  const scannerRef = useRef(null);
  const navegouRef = useRef(false);

  useEffect(() => {
    let cancelado = false;

    async function start() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelado) return;
        const scanner = new Html5Qrcode("reader", { verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            if (navegouRef.current) return;
            navegouRef.current = true;
            const token = extrairToken(decoded);
            setLendo(false);
            scanner.stop().catch(() => {});
            router.push(`/r/${token}`);
          },
          () => {}
        );
      } catch (e) {
        if (!cancelado) {
          setErro(
            "Não consegui abrir a câmera. Permita o acesso à câmera no navegador. (No celular, o app precisa estar em HTTPS.)"
          );
          setLendo(false);
        }
      }
    }
    start();

    return () => {
      cancelado = true;
      const s = scannerRef.current;
      if (s) s.stop().catch(() => {});
    };
  }, [router]);

  return (
    <main className="mx-auto max-w-sm p-6">
      <Link href="/restaurante" className="text-sm text-slate-500 hover:underline">
        ← Voltar
      </Link>
      <h1 className="mb-3 mt-2 text-xl font-bold">Escanear crachá</h1>

      <div className="overflow-hidden rounded-2xl border-4 border-brand bg-black">
        <div id="reader" className="w-full" />
      </div>

      {lendo && !erro && (
        <p className="mt-3 text-center text-sm text-slate-500">
          Aponte para o QR do crachá…
        </p>
      )}
      {erro && (
        <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>
      )}
    </main>
  );
}
