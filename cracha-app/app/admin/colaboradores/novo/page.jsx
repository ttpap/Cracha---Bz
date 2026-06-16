import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import NovoColaboradorForm from "@/components/NovoColaboradorForm";

export const dynamic = "force-dynamic";

export default async function NovoColaboradorPage() {
  await requireAdmin();
  return (
    <>
      <AdminNav active="/admin/colaboradores" />
      <main className="mx-auto max-w-2xl p-4">
        <Link href="/admin/colaboradores" className="text-sm text-slate-500 hover:underline">
          ← Colaboradores
        </Link>
        <h1 className="mb-4 mt-2 text-2xl font-bold">Novo colaborador</h1>
        <NovoColaboradorForm />
      </main>
    </>
  );
}
