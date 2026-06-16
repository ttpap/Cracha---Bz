import Link from "next/link";
import { adminLogout } from "@/lib/actions";

export default function AdminNav({ active }) {
  const items = [
    { href: "/admin", label: "Início" },
    { href: "/admin/colaboradores", label: "Colaboradores" },
    { href: "/admin/importar", label: "Importar" },
    { href: "/admin/restaurantes", label: "Restaurantes" },
    { href: "/admin/visitas", label: "Relatório" },
  ];
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-4 py-3">
        <span className="mr-2 shrink-0 font-bold text-brand">🛠️ Admin</span>
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm ${
              active === it.href
                ? "bg-brand text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {it.label}
          </Link>
        ))}
        <form action={adminLogout} className="ml-auto shrink-0">
          <button className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
