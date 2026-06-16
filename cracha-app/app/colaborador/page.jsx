import Link from "next/link";
import { headers } from "next/headers";
import { getColaborador } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { colaboradorLogout } from "@/lib/actions";
import ColaboradorLoginForm from "@/components/ColaboradorLoginForm";
import Cracha from "@/components/Cracha";
import Logo from "@/components/Logo";
import { formatMoney, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ColaboradorPage() {
  const c = await getColaborador();

  if (!c) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-6">
        <div className="text-center">
          <Logo size={72} className="mx-auto mb-3 shadow-lg" />
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

  const dados = {
    nome: c.nome,
    cargo: c.cargo,
    matricula: c.matricula,
    fotoUrl: c.fotoUrl,
    descontoPct: c.descontoPct,
    empresaNome: c.empresa?.nomeFantasia || c.empresa?.razaoSocial,
  };

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

      {/* Crachá digital (frente/verso) */}
      <div className="mt-3">
        <Cracha c={dados} scanUrl={scanUrl} />
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
      <Link href="/colaborador/senha" className="btn-ghost mt-2 w-full">
        🔑 Trocar minha senha
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
