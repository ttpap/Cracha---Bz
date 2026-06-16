"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { trocarSenhaColaborador } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";

export default function TrocarSenhaForm() {
  const [state, formAction] = useFormState(trocarSenhaColaborador, {});

  if (state?.ok) {
    return (
      <div className="card border-emerald-300 bg-emerald-50 p-6 text-center">
        <div className="text-4xl">✅</div>
        <h2 className="mt-2 font-bold text-emerald-800">Senha alterada!</h2>
        <Link href="/colaborador" className="btn-primary mt-4 w-full">
          Voltar ao meu crachá
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="card flex flex-col gap-4 p-6">
      <div>
        <label className="label">Nova senha</label>
        <input name="nova" type="password" className="input" placeholder="mínimo 4 caracteres" required />
      </div>
      <div>
        <label className="label">Confirmar nova senha</label>
        <input name="confirma" type="password" className="input" required />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Salvar nova senha</SubmitButton>
    </form>
  );
}
