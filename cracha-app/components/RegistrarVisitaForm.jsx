"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { registrarVisita } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";

export default function RegistrarVisitaForm({ token, descontoPct }) {
  const [state, formAction] = useFormState(registrarVisita, {});

  if (state?.ok) {
    return (
      <div className="card border-emerald-300 bg-emerald-50 p-6 text-center">
        <div className="text-4xl">✅</div>
        <h2 className="mt-2 text-lg font-bold text-emerald-800">Visita registrada!</h2>
        <p className="mt-1 text-sm text-emerald-700">
          {state.nome} ·{" "}
          {Number(state.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
        <Link href="/restaurante/scan" className="btn-primary mt-4 w-full">
          📷 Escanear próximo
        </Link>
        <Link href="/restaurante" className="mt-2 block text-sm text-slate-500 hover:underline">
          Voltar ao painel
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="card grid gap-4 p-5">
      <input type="hidden" name="token" value={token} />
      <div>
        <label className="label">Valor da conta (já com {descontoPct}% de desconto)</label>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-slate-500">R$</span>
          <input
            name="valor"
            inputMode="decimal"
            placeholder="0,00"
            className="input text-lg font-bold"
            autoFocus
            required
          />
        </div>
      </div>
      <div>
        <label className="label">Observação (opcional)</label>
        <input name="observacao" className="input" placeholder="ex: almoço, mesa 4" />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton className="btn-primary w-full py-3 text-lg">
        Registrar presença e gasto
      </SubmitButton>
    </form>
  );
}
