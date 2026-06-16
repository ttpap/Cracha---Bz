import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import PrintButton from "@/components/PrintButton";
import Cracha from "@/components/Cracha";

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

  const dados = {
    nome: c.nome,
    cargo: c.cargo,
    matricula: c.matricula,
    fotoUrl: c.fotoUrl,
    descontoPct: c.descontoPct,
    empresaNome: c.empresa?.nomeFantasia || c.empresa?.razaoSocial,
  };

  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-5 p-6">
      <div className="no-print flex w-full items-center justify-between">
        <Link href="/admin/colaboradores" className="text-sm text-slate-500 hover:underline">
          ← Voltar
        </Link>
        <PrintButton />
      </div>

      <Cracha c={dados} scanUrl={scanUrl} />

      <p className="no-print max-w-xs text-center text-xs text-slate-400">
        Ao imprimir, sai a frente e o verso (missão, visão e valores).
      </p>
    </main>
  );
}
