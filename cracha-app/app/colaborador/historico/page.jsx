import Link from "next/link";
import { requireColaborador } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ColaboradorHistorico() {
  const c = await requireColaborador();
  const visitas = await prisma.visita.findMany({
    where: { colaboradorId: c.id },
    orderBy: { createdAt: "desc" },
    include: { restaurante: true },
    take: 300,
  });
  const total = visitas.reduce((s, v) => s + v.valorComDesconto, 0);

  return (
    <main className="mx-auto max-w-md p-5">
      <Link href="/colaborador" className="text-sm text-slate-500 hover:underline">
        ← Meu crachá
      </Link>
      <div className="mb-3 mt-2 flex items-center justify-between">
        <h1 className="text-xl font-bold">Meu histórico</h1>
        <div className="text-right">
          <div className="text-xs text-slate-500">Total</div>
          <div className="font-bold text-brand">{formatMoney(total)}</div>
        </div>
      </div>

      <div className="grid gap-2">
        {visitas.map((v) => (
          <div key={v.id} className="card flex items-center gap-3 p-3">
            <div className="text-2xl">🍽️</div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{v.restaurante.nome}</div>
              <div className="text-xs text-slate-400">
                {new Date(v.createdAt).toLocaleString("pt-BR")} · {v.descontoAplicadoPct}% desc.
              </div>
            </div>
            <div className="font-semibold">{formatMoney(v.valorComDesconto)}</div>
          </div>
        ))}
        {visitas.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            Você ainda não tem visitas registradas.
          </p>
        )}
      </div>
    </main>
  );
}
