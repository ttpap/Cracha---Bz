"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { ADMIN_PASSWORD } from "@/lib/auth";
import { parsePlanilhaBuffer } from "@/lib/parsePlanilha";

const COOKIE_OPTS = { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 };

/* ---------- ADMIN ---------- */

export async function adminLogin(_prev, formData) {
  const senha = String(formData.get("senha") || "");
  if (senha !== ADMIN_PASSWORD) {
    return { error: "Senha incorreta." };
  }
  (await cookies()).set("admin", "ok", COOKIE_OPTS);
  redirect("/admin");
}

export async function adminLogout() {
  (await cookies()).delete("admin");
  redirect("/");
}

export async function salvarColaborador(formData) {
  const id = String(formData.get("id"));
  const desconto = Math.max(0, Math.min(100, parseInt(formData.get("descontoPct") || "0", 10) || 0));
  await prisma.colaborador.update({
    where: { id },
    data: {
      nome: String(formData.get("nome") || "").trim(),
      cargo: String(formData.get("cargo") || "").trim() || null,
      cpf: String(formData.get("cpf") || "").trim() || null,
      email: String(formData.get("email") || "").trim() || null,
      telefone: String(formData.get("telefone") || "").trim() || null,
      senha: String(formData.get("senha") || "").trim() || null,
      descontoPct: desconto,
      ativo: formData.get("ativo") === "on",
    },
  });
  revalidatePath("/admin/colaboradores");
  revalidatePath(`/admin/colaboradores/${id}`);
  redirect(`/admin/colaboradores/${id}?ok=1`);
}

export async function criarColaborador(_prev, formData) {
  const nome = String(formData.get("nome") || "").trim();
  const matricula = String(formData.get("matricula") || "").trim() || null;
  if (!nome) return { error: "Informe o nome." };

  if (matricula) {
    const dup = await prisma.colaborador.findFirst({ where: { matricula } });
    if (dup) return { error: `Já existe colaborador com a matrícula ${matricula}.` };
  }

  let empresa = await prisma.empresa.findFirst();
  if (!empresa) {
    empresa = await prisma.empresa.create({ data: { razaoSocial: "Empresa" } });
  }

  const desconto = Math.max(0, Math.min(100, parseInt(formData.get("descontoPct") || "0", 10) || 0));
  const col = await prisma.colaborador.create({
    data: {
      empresaId: empresa.id,
      nome,
      matricula,
      cargo: String(formData.get("cargo") || "").trim() || null,
      cpf: String(formData.get("cpf") || "").trim() || null,
      email: String(formData.get("email") || "").trim() || null,
      telefone: String(formData.get("telefone") || "").trim() || null,
      senha: String(formData.get("senha") || "").trim() || null,
      descontoPct: desconto,
      qrToken: crypto.randomBytes(9).toString("hex"),
    },
  });
  revalidatePath("/admin/colaboradores");
  redirect(`/admin/colaboradores/${col.id}?ok=1`);
}

export async function importarPlanilha(_prev, formData) {
  const file = formData.get("arquivo");
  if (!file || typeof file === "string" || file.size === 0) {
    return { error: "Selecione um arquivo .xls ou .xlsx." };
  }
  let parsed;
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    parsed = parsePlanilhaBuffer(buf);
  } catch (e) {
    return { error: "Não consegui ler a planilha: " + e.message };
  }
  if (!parsed.colaboradores.length) {
    return { error: "Nenhum colaborador encontrado na planilha." };
  }

  let empresa = await prisma.empresa.findFirst({
    where: { razaoSocial: parsed.empresa.razaoSocial },
  });
  if (!empresa) {
    empresa = await prisma.empresa.create({ data: parsed.empresa });
  }

  let novos = 0;
  let pulados = 0;
  for (const c of parsed.colaboradores) {
    const existe = c.matricula
      ? await prisma.colaborador.findFirst({
          where: { empresaId: empresa.id, matricula: c.matricula },
        })
      : null;
    if (existe) {
      pulados++;
      continue;
    }
    await prisma.colaborador.create({
      data: {
        ...c,
        empresaId: empresa.id,
        descontoPct: 0,
        qrToken: crypto.randomBytes(9).toString("hex"),
      },
    });
    novos++;
  }

  revalidatePath("/admin/colaboradores");
  return { ok: true, novos, pulados, empresa: empresa.razaoSocial };
}

export async function adicionarRestaurante(_prev, formData) {
  const nome = String(formData.get("nome") || "").trim();
  const login = String(formData.get("login") || "").trim().toLowerCase();
  const pin = String(formData.get("pin") || "").trim();
  if (!nome || !login || !pin) return { error: "Preencha nome, login e PIN." };
  const existe = await prisma.restaurante.findUnique({ where: { login } });
  if (existe) return { error: "Já existe um restaurante com esse login." };
  await prisma.restaurante.create({ data: { nome, login, pin } });
  revalidatePath("/admin/restaurantes");
  return { ok: true, nome };
}

export async function removerRestaurante(formData) {
  const id = String(formData.get("id"));
  await prisma.visita.deleteMany({ where: { restauranteId: id } });
  await prisma.restaurante.delete({ where: { id } });
  revalidatePath("/admin/restaurantes");
}

/* ---------- RESTAURANTE ---------- */

export async function restauranteLogin(_prev, formData) {
  const login = String(formData.get("login") || "").trim().toLowerCase();
  const pin = String(formData.get("pin") || "").trim();
  const rest = await prisma.restaurante.findUnique({ where: { login } });
  if (!rest || rest.pin !== pin) {
    return { error: "Login ou PIN incorretos." };
  }
  (await cookies()).set("restauranteId", rest.id, COOKIE_OPTS);
  redirect("/restaurante");
}

export async function restauranteLogout() {
  (await cookies()).delete("restauranteId");
  redirect("/restaurante");
}

/* ---------- COLABORADOR ---------- */

const soDigitos = (s) => String(s || "").replace(/\D/g, "");

export async function colaboradorLogin(_prev, formData) {
  const matricula = String(formData.get("matricula") || "").trim();
  const segredoRaw = String(formData.get("cpf") || "").trim();
  if (!matricula || !segredoRaw) return { error: "Informe matrícula e CPF (ou senha)." };

  const col = await prisma.colaborador.findFirst({ where: { matricula } });
  const cpfOk = col?.cpf && soDigitos(col.cpf) === soDigitos(segredoRaw);
  const senhaOk = col?.senha && col.senha === segredoRaw;
  if (!col || (!cpfOk && !senhaOk)) {
    return { error: "Matrícula ou CPF/senha não conferem." };
  }
  (await cookies()).set("colaboradorId", col.id, COOKIE_OPTS);
  redirect("/colaborador");
}

export async function colaboradorLogout() {
  (await cookies()).delete("colaboradorId");
  redirect("/colaborador");
}

export async function registrarVisita(_prev, formData) {
  const token = String(formData.get("token") || "");
  const valor = parseFloat(String(formData.get("valor") || "0").replace(",", "."));
  const observacao = String(formData.get("observacao") || "").trim() || null;

  const restauranteId = (await cookies()).get("restauranteId")?.value;
  if (!restauranteId) return { error: "Faça login do restaurante primeiro." };

  const col = await prisma.colaborador.findUnique({ where: { qrToken: token } });
  if (!col) return { error: "Crachá não encontrado." };
  if (!col.ativo) return { error: "Colaborador inativo." };
  if (!isFinite(valor) || valor <= 0) return { error: "Informe um valor válido." };

  await prisma.visita.create({
    data: {
      colaboradorId: col.id,
      restauranteId,
      valorComDesconto: valor,
      descontoAplicadoPct: col.descontoPct,
      observacao,
    },
  });

  revalidatePath("/restaurante/historico");
  return { ok: true, valor, nome: col.nome };
}
