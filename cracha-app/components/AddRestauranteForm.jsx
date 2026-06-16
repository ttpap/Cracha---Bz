"use client";

import { useFormState } from "react-dom";
import { adicionarRestaurante } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";

export default function AddRestauranteForm() {
  const [state, formAction] = useFormState(adicionarRestaurante, {});
  return (
    <form action={formAction} className="card grid gap-3 p-5">
      <h2 className="font-semibold">Adicionar restaurante</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label">Nome</label>
          <input name="nome" className="input" placeholder="Restaurante Centro" required />
        </div>
        <div>
          <label className="label">Login</label>
          <input name="login" className="input" placeholder="centro" required />
        </div>
        <div>
          <label className="label">PIN</label>
          <input name="pin" className="input" placeholder="1234" required />
        </div>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && (
        <p className="text-sm text-emerald-700">✓ {state.nome} adicionado.</p>
      )}
      <SubmitButton className="btn-primary w-fit">Adicionar</SubmitButton>
    </form>
  );
}
