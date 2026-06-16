import Link from "next/link";
import { headers } from "next/headers";
import { getColaborador } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { colaboradorLogout } from "@/lib/actions";
import ColaboradorLoginForm from "@/components/ColaboradorLoginForm";
import QRCode from "@/components/QRCode";
import { formatMoney, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ColaboradorPage() {
  const c = await getColaborador();

  if (!c) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-2xl text-white">
            🪪
          </div>
          <h1 className="text-xl font-bold">Colaborador</h1>
          <p className="text-sm text-slate-500">Acesse seu crachá e seus gastos</p>
        </div>
        <ColaboradorLoginForm />
        <Link href="/" className="text-center text-sm text-slate-500 hover:underline">
          ← Início
        </Link>
      </main>
    );
  }

  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  const scanUrl = `${proto}://${host}/r/${c.qrToken}`;

  const agg = await prisma.visita.aggregate({
    where: { colaboradorId: c.id },
    _count: true,
    _sum: { valorComDesconto: true },
  });

  return (
    <main className="mx-auto max-w-sm p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Meu crachá</h1>
        <form action={colaboradorLogout}>
          <button className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">
            Sair
          </button>
        </form>
      </div>

      {/* Crachá digital */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-300 bg-white shadow">
        <div className="bg-brand px-5 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white">
          {c.empresa?.nomeFantasia || c.empresa?.razaoSocial}
        </div>
        <div className="flex flex-col items-center px-5 py-5">
          {c.fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.fotoUrl} alt={c.nome} className="h-24 w-24 rounded-full border-4 border-brand/20 object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand/10 text-2xl font-bold text-brand">
              {c.nome[0]}
            </div>
          )}
          <h2 className="mt-3 text-center text-lg font-bold leading-tight">{c.nome}</h2>
          <p className="text-sm text-slate-500">{c.cargo || "—"}</p>
          <p className="text-xs text-slate-400">Matrícula {c.matricula || "—"}</p>

          {c.descontoPct > 0 && (
            <div className="mt-3 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
              {c.descontoPct}% de desconto
            </div>
          )}

          <div className="mt-4 rounded-xl border border-slate-200 p-2">
            <QRCode value={scanUrl} size={170} />
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Mostre este QR no restaurante
          </p>
        </div>
      </div>

      {/* Resumo de gastos */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="text-2xl font-bold">{agg._count}</div>
          <div className="text-sm text-slate-500">Visitas</div>
        </div>
        <div className="card p-4">
          <div className="text-xl font-bold text-brand">
            {formatMoney(agg._sum.valorComDesconto || 0)}
          </div>
          <div className="text-sm text-slate-500">Total gasto</div>
        </div>
      </div>

      <Link href="/colaborador/historico" className="btn-ghost mt-3 w-full">
        🧾 Ver meu histórico
      </Link>

      <div className="card mt-4 grid gap-1 p-4 text-sm">
        <h3 className="font-semibold">Meus dados</h3>
        <Info label="CPF" value={c.cpf} />
        <Info label="E-mail" value={c.email} />
        <Info label="Telefone" value={c.telefone} />
        <Info label="Admissão" value={formatDate(c.admissao)} />
      </div>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-1 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium">{value || "—"}</span>
    </div>
  );
}
