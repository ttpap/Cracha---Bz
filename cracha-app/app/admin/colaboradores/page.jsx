import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function ColaboradoresPage() {
  await requireAdmin();
  const colaboradores = await prisma.colaborador.findMany({
    orderBy: { nome: "asc" },
    include: { empresa: true },
  });

  return (
    <>
      <AdminNav active="/admin/colaboradores" />
      <main className="mx-auto max-w-4xl p-4">
        <div className="mb-4 mt-2 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Colaboradores</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{colaboradores.length} no total</span>
            <Link href="/admin/colaboradores/novo" className="btn-primary px-3 py-1.5 text-sm">
              + Novo
            </Link>
          </div>
        </div>

        {colaboradores.length === 0 && (
          <div className="card p-8 text-center text-slate-500">
            Nenhum colaborador.{" "}
            <Link href="/admin/importar" className="text-brand underline">
              Importar planilha
            </Link>
          </div>
        )}

        <div className="grid gap-3">
          {colaboradores.map((c) => (
            <div key={c.id} className="card flex items-center gap-4 p-3">
              <Avatar c={c} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{c.nome}</span>
                  {!c.ativo && (
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">inativo</span>
                  )}
                </div>
                <div className="truncate text-sm text-slate-500">
                  {c.cargo || "—"} · mat. {c.matricula || "—"}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`rounded-full px-2.5 py-1 text-sm font-semibold ${
                    c.descontoPct > 0
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {c.descontoPct}% desc.
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <Link href={`/admin/colaboradores/${c.id}`} className="btn-ghost px-3 py-1.5 text-sm">
                  Editar
                </Link>
                <Link
                  href={`/cracha/${c.id}`}
                  target="_blank"
                  className="btn-primary px-3 py-1.5 text-sm"
                >
                  Crachá
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

function Avatar({ c }) {
  if (c.fotoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={c.fotoUrl} alt={c.nome} className="h-14 w-14 rounded-full object-cover" />;
  }
  const ini = c.nome.split(" ").slice(0, 2).map((s) => s[0]).join("");
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 font-bold text-brand">
      {ini}
    </div>
  );
}
