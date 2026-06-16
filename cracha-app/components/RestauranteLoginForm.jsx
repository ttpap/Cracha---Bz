"use client";

import { useFormState } from "react-dom";
import { restauranteLogin } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";

export default function RestauranteLoginForm() {
  const [state, formAction] = useFormState(restauranteLogin, {});
  return (
    <form action={formAction} className="card flex flex-col gap-4 p-6">
      <div>
        <label className="label">Login do restaurante</label>
        <input name="login" className="input" placeholder="demo" autoCapitalize="none" required />
      </div>
      <div>
        <label className="label">PIN</label>
        <input name="pin" type="password" inputMode="numeric" className="input" placeholder="••••" required />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Entrar</SubmitButton>
    </form>
  );
}
