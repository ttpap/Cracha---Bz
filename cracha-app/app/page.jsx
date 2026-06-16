import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-3xl text-white">
          🪪
        </div>
        <h1 className="text-2xl font-bold">Crachá Colaboradores</h1>
        <p className="mt-1 text-slate-500">
          Crachás com QR, desconto e registro de presença
        </p>
      </div>

      <div className="grid gap-3">
        <Link href="/admin" className="card flex items-center gap-4 p-5 hover:border-brand">
          <span className="text-3xl">🛠️</span>
          <span>
            <span className="block font-semibold">Administrador</span>
            <span className="text-sm text-slate-500">
              Cadastrar colaboradores, definir desconto, gerar crachás
            </span>
          </span>
        </Link>

        <Link href="/restaurante" className="card flex items-center gap-4 p-5 hover:border-brand">
          <span className="text-3xl">🍽️</span>
          <span>
            <span className="block font-semibold">Restaurante</span>
            <span className="text-sm text-slate-500">
              Escanear crachá, ver desconto e registrar gasto
            </span>
          </span>
        </Link>

        <Link href="/colaborador" className="card flex items-center gap-4 p-5 hover:border-brand">
          <span className="text-3xl">🪪</span>
          <span>
            <span className="block font-semibold">Colaborador</span>
            <span className="text-sm text-slate-500">
              Ver seu crachá digital, desconto e gastos
            </span>
          </span>
        </Link>
      </div>
    </main>
  );
}
