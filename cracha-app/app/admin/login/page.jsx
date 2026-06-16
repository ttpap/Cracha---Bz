"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { adminLogin } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(adminLogin, {});
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-2xl text-white">
          🛠️
        </div>
        <h1 className="text-xl font-bold">Administrador</h1>
        <p className="text-sm text-slate-500">Acesso ao painel de cadastro</p>
      </div>

      <form action={formAction} className="card flex flex-col gap-4 p-6">
        <div>
          <label className="label">Senha</label>
          <input name="senha" type="password" className="input" autoFocus placeholder="••••••" />
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <SubmitButton>Entrar</SubmitButton>
        <Link href="/" className="text-center text-sm text-slate-500 hover:underline">
          ← Voltar
        </Link>
      </form>
      <p className="text-center text-xs text-slate-400">Senha padrão: admin123</p>
    </main>
  );
}
