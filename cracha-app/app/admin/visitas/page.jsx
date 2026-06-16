import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminNav from "@/components/AdminNav";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function VisitasPage() {
  await requireAdmin();
  const visitas = await prisma.visita.findMany({
    orderBy: { createdAt: "desc" },
    include: { colaborador: true, restaurante: true },
    take: 500,
  });
  const total = visitas.reduce((s, v) => s + v.valorComDesconto, 0);

  return (
    <>
      <AdminNav active="/admin/visitas" />
      <main className="mx-auto max-w-4xl p-4">
        <div className="mb-4 mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Relatório de visitas</h1>
          <div className="text-right">
            <div className="text-sm text-slate-500">Total gasto</div>
            <div className="text-xl font-bold text-brand">{formatMoney(total)}</div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="hidden grid-cols-[1fr,1fr,auto,auto,auto] gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase text-slate-500 sm:grid">
            <div>Colaborador</div>
            <div>Restaurante</div>
            <div className="text-right">Desc.</div>
            <div className="text-right">Valor</div>
            <div className="text-right">Quando</div>
          </div>
          {visitas.map((v) => (
            <div
              key={v.id}
              className="grid grid-cols-2 gap-x-2 gap-y-1 border-b border-slate-100 px-4 py-3 text-sm last:border-0 sm:grid-cols-[1fr,1fr,auto,auto,auto] sm:items-center"
            >
              <div className="font-medium">{v.colaborador.nome}</div>
              <div className="text-slate-600">{v.restaurante.nome}</div>
              <div className="text-right text-slate-500">{v.descontoAplicadoPct}%</div>
              <div className="text-right font-semibold">{formatMoney(v.valorComDesconto)}</div>
              <div className="text-right text-slate-400">
                {new Date(v.createdAt).toLocaleString("pt-BR")}
              </div>
            </div>
          ))}
          {visitas.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500">Nenhuma visita registrada ainda.</div>
          )}
        </div>
      </main>
    </>
  );
}
