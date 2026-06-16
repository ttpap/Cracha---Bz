"use client";

import { useFormState } from "react-dom";
import { colaboradorLogin } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";

export default function ColaboradorLoginForm() {
  const [state, formAction] = useFormState(colaboradorLogin, {});
  return (
    <form action={formAction} className="card flex flex-col gap-4 p-6">
      <div>
        <label className="label">CPF</label>
        <input name="login" inputMode="numeric" className="input" placeholder="000.000.000-00" required />
      </div>
      <div>
        <label className="label">Senha</label>
        <input name="senha" type="password" className="input" placeholder="••••••" required />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Entrar</SubmitButton>
      <p className="text-center text-xs text-slate-400">
        Senha inicial: <b>bz123</b> (troque depois de entrar)
      </p>
    </form>
  );
}
