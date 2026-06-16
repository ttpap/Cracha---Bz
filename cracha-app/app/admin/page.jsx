import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminNav from "@/components/AdminNav";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await requireAdmin();

  const [colabs, restaurantes, visitas, soma] = await Promise.all([
    prisma.colaborador.count(),
    prisma.restaurante.count(),
    prisma.visita.count(),
    prisma.visita.aggregate({ _sum: { valorComDesconto: true } }),
  ]);

  const cards = [
    { label: "Colaboradores", value: colabs, href: "/admin/colaboradores", icon: "👥" },
    { label: "Restaurantes", value: restaurantes, href: "/admin/restaurantes", icon: "🍽️" },
    { label: "Visitas registradas", value: visitas, href: "/admin/visitas", icon: "🧾" },
    {
      label: "Total gasto (c/ desconto)",
      value: formatMoney(soma._sum.valorComDesconto || 0),
      href: "/admin/visitas",
      icon: "💰",
    },
  ];

  return (
    <>
      <AdminNav active="/admin" />
      <main className="mx-auto max-w-4xl p-4">
        <h1 className="mb-4 mt-2 text-2xl font-bold">Painel</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className="card p-4 hover:border-brand">
              <div className="text-2xl">{c.icon}</div>
              <div className="mt-2 text-2xl font-bold">{c.value}</div>
              <div className="text-sm text-slate-500">{c.label}</div>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/admin/colaboradores" className="btn-primary">
            👥 Ver colaboradores e crachás
          </Link>
          <Link href="/admin/importar" className="btn-ghost">
            ⬆️ Importar planilha (.xlsx)
          </Link>
        </div>
      </main>
    </>
  );
}
