import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import QRCode from "@/components/QRCode";
import PrintButton from "@/components/PrintButton";
import Foto from "@/components/Foto";
import Logo from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function CrachaPage({ params }) {
  const { id } = await params;
  const c = await prisma.colaborador.findUnique({
    where: { id },
    include: { empresa: true },
  });
  if (!c) notFound();

  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  const scanUrl = `${proto}://${host}/r/${c.qrToken}`;

  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-5 p-6">
      <div className="no-print flex w-full items-center justify-between">
        <Link href="/admin/colaboradores" className="text-sm text-slate-500 hover:underline">
          ← Voltar
        </Link>
        <PrintButton />
      </div>

      {/* Crachá */}
      <div className="w-[340px] overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-lg">
        <div className="flex items-center justify-center gap-2 bg-brand-gradient px-5 py-3 text-white">
          <Logo size={28} ring />
          <div className="text-sm font-semibold uppercase tracking-wide">
            {c.empresa?.nomeFantasia || c.empresa?.razaoSocial}
          </div>
        </div>

        <div className="flex flex-col items-center px-5 py-5">
          <Foto src={c.fotoUrl} nome={c.nome} size={112} className="border-4 border-brand/20" />

          <h1 className="mt-3 text-center text-lg font-bold leading-tight">{c.nome}</h1>
          <p className="text-center text-sm text-slate-500">{c.cargo || "—"}</p>
          <p className="mt-1 text-xs text-slate-400">Matrícula {c.matricula || "—"}</p>

          {c.descontoPct > 0 && (
            <div className="mt-3 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
              {c.descontoPct}% de desconto
            </div>
          )}

          <div className="mt-4 rounded-xl border border-slate-200 p-2">
            <QRCode value={scanUrl} size={150} />
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Aponte a câmera do restaurante para este QR
          </p>
        </div>
      </div>

      <p className="no-print max-w-xs text-center text-xs text-slate-400">
        O QR aponta para <code className="break-all">{scanUrl}</code>
      </p>
    </main>
  );
}
