import Link from "next/link";
import { prisma } from "@/lib/db";
import { getRestaurante } from "@/lib/auth";
import RegistrarVisitaForm from "@/components/RegistrarVisitaForm";
import Foto from "@/components/Foto";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ScanLanding({ params }) {
  const { token } = await params;
  const c = await prisma.colaborador.findUnique({
    where: { qrToken: token },
    include: { empresa: true },
  });

  if (!c) {
    return (
      <main className="mx-auto max-w-sm p-6 text-center">
        <div className="mt-10 text-5xl">❌</div>
        <h1 className="mt-3 text-lg font-bold">Crachá não reconhecido</h1>
        <p className="mt-1 text-sm text-slate-500">Este QR não corresponde a nenhum colaborador.</p>
        <Link href="/restaurante" className="btn-ghost mt-5">
          Voltar
        </Link>
      </main>
    );
  }

  const rest = await getRestaurante();

  return (
    <main className="mx-auto max-w-sm p-5">
      {/* Ficha do colaborador */}
      <div className="card overflow-hidden">
        <div className="bg-brand px-5 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white">
          {c.empresa?.nomeFantasia || c.empresa?.razaoSocial}
        </div>
        <div className="flex flex-col items-center px-5 py-5">
          <Foto src={c.fotoUrl} nome={c.nome} size={96} />
          <h1 className="mt-3 text-center text-lg font-bold leading-tight">{c.nome}</h1>
          <p className="text-sm text-slate-500">{c.cargo || "—"}</p>
          <p className="text-xs text-slate-400">
            Matrícula {c.matricula || "—"} · Admissão {formatDate(c.admissao)}
          </p>

          <div
            className={`mt-3 rounded-full px-4 py-1.5 text-base font-bold ${
              c.descontoPct > 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {c.descontoPct > 0 ? `${c.descontoPct}% de desconto` : "Sem desconto"}
          </div>

          {!c.ativo && (
            <p className="mt-2 rounded bg-red-100 px-2 py-1 text-sm text-red-700">
              Crachá inativo
            </p>
          )}
        </div>
      </div>

      {/* Registro */}
      <div className="mt-4">
        {rest ? (
          <>
            <p className="mb-2 text-center text-sm text-slate-500">
              Registrando em <b>{rest.nome}</b>
            </p>
            {c.ativo ? (
              <RegistrarVisitaForm token={c.qrToken} descontoPct={c.descontoPct} />
            ) : (
              <p className="text-center text-sm text-red-600">
                Colaborador inativo — não é possível registrar.
              </p>
            )}
          </>
        ) : (
          <div className="card p-5 text-center">
            <p className="text-sm text-slate-600">
              Para registrar a presença e o gasto, faça login do restaurante.
            </p>
            <Link href="/restaurante" className="btn-primary mt-3 w-full">
              Entrar como restaurante
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
