import Link from "next/link";
import { requireColaborador } from "@/lib/auth";
import TrocarSenhaForm from "@/components/TrocarSenhaForm";

export const dynamic = "force-dynamic";

export default async function TrocarSenhaPage() {
  const c = await requireColaborador();
  return (
    <main className="mx-auto max-w-sm p-5">
      <Link href="/colaborador" className="text-sm text-slate-500 hover:underline">
        ← Meu crachá
      </Link>
      <h1 className="mb-1 mt-2 text-xl font-bold">Trocar senha</h1>
      <p className="mb-4 text-sm text-slate-500">{c.nome}</p>
      <TrocarSenhaForm />
    </main>
  );
}
