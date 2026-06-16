"use client";

import { useFormState } from "react-dom";
import { colaboradorLogin } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";

export default function ColaboradorLoginForm() {
  const [state, formAction] = useFormState(colaboradorLogin, {});
  return (
    <form action={formAction} className="card flex flex-col gap-4 p-6">
      <div>
        <label className="label">Matrícula</label>
        <input name="matricula" inputMode="numeric" className="input" placeholder="6350000022" required />
      </div>
      <div>
        <label className="label">CPF ou senha</label>
        <input name="cpf" className="input" placeholder="CPF ou senha" required />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Entrar</SubmitButton>
    </form>
  );
}
