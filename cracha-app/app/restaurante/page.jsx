import Link from "next/link";
import { getRestaurante } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { restauranteLogout } from "@/lib/actions";
import RestauranteLoginForm from "@/components/RestauranteLoginForm";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RestaurantePage() {
  const rest = await getRestaurante();

  if (!rest) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-2xl text-white">
            🍽️
          </div>
          <h1 className="text-xl font-bold">Restaurante</h1>
          <p className="text-sm text-slate-500">Entre para escanear crachás</p>
        </div>
        <RestauranteLoginForm />
        <Link href="/" className="text-center text-sm text-slate-500 hover:underline">
          ← Início
        </Link>
        <p className="text-center text-xs text-slate-400">Demo → login: demo / PIN: 1234</p>
      </main>
    );
  }

  const agg = await prisma.visita.aggregate({
    where: { restauranteId: rest.id },
    _count: true,
    _sum: { valorComDesconto: true },
  });

  return (
    <main className="mx-auto max-w-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{rest.nome}</h1>
          <p className="text-sm text-slate-500">Painel do restaurante</p>
        </div>
        <form action={restauranteLogout}>
          <button className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">
            Sair
          </button>
        </form>
      </div>

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

      <Link href="/restaurante/scan" className="btn-primary mt-5 w-full py-4 text-lg">
        📷 Escanear crachá
      </Link>
      <Link href="/restaurante/historico" className="btn-ghost mt-3 w-full">
        🧾 Ver histórico
      </Link>
    </main>
  );
}
