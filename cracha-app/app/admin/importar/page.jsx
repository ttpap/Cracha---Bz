"use client";

import { useFormState } from "react-dom";
import { importarPlanilha } from "@/lib/actions";
import AdminNav from "@/components/AdminNav";
import SubmitButton from "@/components/SubmitButton";

export default function ImportarPage() {
  const [state, formAction] = useFormState(importarPlanilha, {});
  return (
    <>
      <AdminNav active="/admin/importar" />
      <main className="mx-auto max-w-xl p-4">
        <h1 className="mb-1 mt-2 text-2xl font-bold">Importar planilha</h1>
        <p className="mb-4 text-sm text-slate-500">
          Envie a planilha de colaboradores (.xls ou .xlsx) no mesmo formato da ficha. Colaboradores
          com matrícula já cadastrada são ignorados.
        </p>

        <form action={formAction} className="card grid gap-4 p-5">
          <div>
            <label className="label">Arquivo</label>
            <input
              name="arquivo"
              type="file"
              accept=".xls,.xlsx"
              required
              className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white"
            />
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          {state?.ok && (
            <div className="rounded-lg bg-emerald-100 px-4 py-3 text-sm text-emerald-700">
              ✓ Importado para <b>{state.empresa}</b>: {state.novos} novo(s)
              {state.pulados ? `, ${state.pulados} já existia(m)` : ""}.
            </div>
          )}

          <SubmitButton>Importar</SubmitButton>
        </form>
      </main>
    </>
  );
}
