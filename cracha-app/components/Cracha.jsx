"use client";

import { useState } from "react";
import QRCode from "@/components/QRCode";
import Foto from "@/components/Foto";
import Logo from "@/components/Logo";
import { GRUPO, MISSAO, VISAO, VALORES } from "@/lib/empresa";

const W = 340;

function Frente({ c, scanUrl }) {
  return (
    <div
      className="cracha-card relative overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-lg"
      style={{ width: W }}
    >
      {/* topo gradiente da marca */}
      <div className="h-[180px] bg-brand-gradient">
        <div className="flex items-center justify-center gap-2 px-5 pt-6 text-white">
          <Logo size={26} ring />
          <span className="text-sm font-semibold uppercase tracking-wide">
            {c.empresaNome}
          </span>
        </div>
      </div>

      {/* foto sobreposta (metade no gradiente, metade no branco) */}
      <div className="-mt-[82px] flex justify-center">
        <div className="rounded-full bg-white p-1.5 shadow-md">
          <Foto src={c.fotoUrl} nome={c.nome} size={156} />
        </div>
      </div>

      {/* nome + cargo */}
      <div className="px-5 pb-2 pt-3 text-center">
        <h2 className="text-2xl font-extrabold leading-tight text-brand">{c.nome}</h2>
        <p className="mt-0.5 text-sm font-semibold uppercase tracking-wider text-slate-500">
          {c.cargo || "—"}
        </p>
        {c.descontoPct > 0 && (
          <span className="mt-2 inline-block rounded-full bg-brand/10 px-3 py-0.5 text-sm font-bold text-brand">
            {c.descontoPct}% de desconto
          </span>
        )}
      </div>

      {/* QR */}
      <div className="flex flex-col items-center pb-3">
        <div className="rounded-xl border border-slate-200 p-1.5">
          <QRCode value={scanUrl} size={104} />
        </div>
        <p className="mt-1 text-[10px] text-slate-400">Apresente este QR no restaurante</p>
      </div>

      {/* rodapé Grupo BZ */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-center gap-2 rounded-full border border-brand/40 py-2 text-sm font-medium text-brand">
          Uma empresa do <Logo size={20} /> {GRUPO}
        </div>
      </div>
    </div>
  );
}

function Bloco({ titulo, children }) {
  return (
    <div>
      <div className="mx-auto w-fit rounded-full border-2 border-brand/50 px-8 py-1.5">
        <span className="text-xl font-extrabold tracking-wide text-brand">{titulo}</span>
      </div>
      <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}

function Verso({ c }) {
  return (
    <div
      className="cracha-card flex flex-col gap-5 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-6 shadow-lg"
      style={{ width: W, minHeight: 540 }}
    >
      <div className="flex items-center justify-center gap-2 pb-1 text-brand">
        <Logo size={22} ring />
        <span className="text-xs font-semibold uppercase tracking-wide">{c.empresaNome}</span>
      </div>
      <Bloco titulo="MISSÃO">{MISSAO}</Bloco>
      <Bloco titulo="VISÃO">{VISAO}</Bloco>
      <Bloco titulo="VALORES">{VALORES}</Bloco>
      <div className="mt-auto flex items-center justify-center gap-2 pt-2 text-xs font-medium text-slate-400">
        Uma empresa do <Logo size={16} /> {GRUPO}
      </div>
    </div>
  );
}

export default function Cracha({ c, scanUrl, showFlip = true }) {
  const [lado, setLado] = useState("frente");
  return (
    <div className="flex flex-col items-center gap-4">
      {/* TELA: mostra um lado por vez */}
      <div className="cracha-screen">
        {lado === "frente" ? <Frente c={c} scanUrl={scanUrl} /> : <Verso c={c} />}
      </div>

      {showFlip && (
        <button
          onClick={() => setLado((l) => (l === "frente" ? "verso" : "frente"))}
          className="btn-ghost no-print text-sm"
        >
          🔄 Ver {lado === "frente" ? "verso (missão, visão, valores)" : "frente"}
        </button>
      )}

      {/* IMPRESSÃO: mostra frente E verso */}
      <div className="cracha-print hidden flex-col items-center gap-6">
        <Frente c={c} scanUrl={scanUrl} />
        <Verso c={c} />
      </div>
    </div>
  );
}
