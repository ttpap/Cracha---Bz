import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { removerRestaurante } from "@/lib/actions";
import AdminNav from "@/components/AdminNav";
import AddRestauranteForm from "@/components/AddRestauranteForm";

export const dynamic = "force-dynamic";

export default async function RestaurantesPage() {
  await requireAdmin();
  const restaurantes = await prisma.restaurante.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { visitas: true } } },
  });

  return (
    <>
      <AdminNav active="/admin/restaurantes" />
      <main className="mx-auto max-w-2xl p-4">
        <h1 className="mb-1 mt-2 text-2xl font-bold">Restaurantes</h1>
        <p className="mb-4 text-sm text-slate-500">
          Cada restaurante usa um <b>login + PIN</b> para entrar no leitor e registrar visitas.
        </p>

        <AddRestauranteForm />

        <div className="mt-4 grid gap-3">
          {restaurantes.map((r) => (
            <div key={r.id} className="card flex items-center gap-4 p-4">
              <div className="text-2xl">🍽️</div>
              <div className="flex-1">
                <div className="font-semibold">{r.nome}</div>
                <div className="text-sm text-slate-500">
                  login: <b>{r.login}</b> · PIN: <b>{r.pin}</b> · {r._count.visitas} visita(s)
                </div>
              </div>
              <form action={removerRestaurante}>
                <input type="hidden" name="id" value={r.id} />
                <button className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                  Remover
                </button>
              </form>
            </div>
          ))}
          {restaurantes.length === 0 && (
            <p className="text-center text-sm text-slate-500">Nenhum restaurante cadastrado.</p>
          )}
        </div>
      </main>
    </>
  );
}
