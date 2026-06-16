import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function isAdmin() {
  const c = await cookies();
  return c.get("admin")?.value === "ok";
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function getRestaurante() {
  const c = await cookies();
  const id = c.get("restauranteId")?.value;
  if (!id) return null;
  try {
    return await prisma.restaurante.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function requireRestaurante() {
  const r = await getRestaurante();
  if (!r) redirect("/restaurante");
  return r;
}

export async function getColaborador() {
  const c = await cookies();
  const id = c.get("colaboradorId")?.value;
  if (!id) return null;
  try {
    return await prisma.colaborador.findUnique({
      where: { id },
      include: { empresa: true },
    });
  } catch {
    return null;
  }
}

export async function requireColaborador() {
  const c = await getColaborador();
  if (!c) redirect("/colaborador");
  return c;
}
