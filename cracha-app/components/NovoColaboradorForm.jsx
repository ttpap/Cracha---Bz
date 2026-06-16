"use client";

import { useFormState } from "react-dom";
import { criarColaborador } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";

export default function NovoColaboradorForm() {
  const [state, formAction] = useFormState(criarColaborador, {});
  return (
    <form action={formAction} className="card grid gap-4 p-5">
      <Field label="Nome *" name="nome" required placeholder="Antonio Carlos Pap Almeida" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Matrícula" name="matricula" placeholder="12345" />
        <Field label="Cargo / função" name="cargo" />
        <Field label="CPF" name="cpf" />
        <Field label="Senha (opcional)" name="senha" placeholder="ex: 321" />
        <Field label="E-mail" name="email" />
        <Field label="Telefone" name="telefone" />
        <Field label="Desconto (%)" name="descontoPct" type="number" defaultValue="0" />
      </div>
      <p className="text-xs text-slate-400">
        Login do colaborador: matrícula + CPF (ou matrícula + senha, se preenchida).
      </p>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Criar colaborador</SubmitButton>
    </form>
  );
}

function Field({ label, name, type = "text", ...rest }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input name={name} type={type} className="input" {...rest} />
    </div>
  );
}
