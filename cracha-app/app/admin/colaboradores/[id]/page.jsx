import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { salvarColaborador } from "@/lib/actions";
import AdminNav from "@/components/AdminNav";
import SubmitButton from "@/components/SubmitButton";
import Foto from "@/components/Foto";
import { formatDate, enderecoCompleto } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ColaboradorDetail({ params, searchParams }) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const c = await prisma.colaborador.findUnique({
    where: { id },
    include: { empresa: true },
  });
  if (!c) notFound();

  return (
    <>
      <AdminNav active="/admin/colaboradores" />
      <main className="mx-auto max-w-2xl p-4">
        <Link href="/admin/colaboradores" className="text-sm text-slate-500 hover:underline">
          ← Colaboradores
        </Link>

        {sp?.ok && (
          <div className="mt-3 rounded-lg bg-emerald-100 px-4 py-2 text-sm text-emerald-700">
            ✓ Salvo com sucesso.
          </div>
        )}

        <div className="mt-3 flex items-center gap-4">
          <Foto src={c.fotoUrl} nome={c.nome} size={80} />
          <div>
            <h1 className="text-xl font-bold">{c.nome}</h1>
            <p className="text-sm text-slate-500">{c.empresa?.razaoSocial}</p>
            <Link
              href={`/cracha/${c.id}`}
              target="_blank"
              className="mt-1 inline-block text-sm font-medium text-brand hover:underline"
            >
              🪪 Abrir / imprimir crachá →
            </Link>
          </div>
        </div>

        <form action={salvarColaborador} className="card mt-4 grid gap-4 p-5">
          <input type="hidden" name="id" value={c.id} />

          <div className="rounded-xl border-2 border-brand/30 bg-brand/5 p-4">
            <label className="label text-brand">Desconto deste colaborador (%)</label>
            <div className="flex items-center gap-2">
              <input
                name="descontoPct"
                type="number"
                min="0"
                max="100"
                defaultValue={c.descontoPct}
                className="input w-28 text-lg font-bold"
              />
              <span className="text-slate-500">% em todos os restaurantes</span>
            </div>
          </div>

          <Field label="Nome" name="nome" defaultValue={c.nome} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cargo / função" name="cargo" defaultValue={c.cargo || ""} />
            <Field label="CPF" name="cpf" defaultValue={c.cpf || ""} />
            <Field label="E-mail" name="email" defaultValue={c.email || ""} />
            <Field label="Telefone" name="telefone" defaultValue={c.telefone || ""} />
            <Field
              label="Senha do colaborador (opcional)"
              name="senha"
              defaultValue={c.senha || ""}
            />
          </div>
          <p className="-mt-2 text-xs text-slate-400">
            O colaborador entra com matrícula + CPF. Se definir uma senha aqui, ele também pode
            entrar com matrícula + senha.
          </p>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="ativo" defaultChecked={c.ativo} className="h-4 w-4" />
            Crachá ativo (pode usar desconto)
          </label>

          <SubmitButton>Salvar alterações</SubmitButton>
        </form>

        <div className="card mt-4 grid gap-2 p-5 text-sm">
          <h2 className="font-semibold">Dados da ficha (somente leitura)</h2>
          <Info label="Matrícula" value={c.matricula} />
          <Info label="Admissão" value={formatDate(c.admissao)} />
          <Info label="Nascimento" value={formatDate(c.nascimento)} />
          <Info label="Endereço" value={enderecoCompleto(c)} />
        </div>
      </main>
    </>
  );
}

function Field({ label, name, defaultValue }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input name={name} defaultValue={defaultValue} className="input" />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-1 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium">{value || "—"}</span>
    </div>
  );
}
