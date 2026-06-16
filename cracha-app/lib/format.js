export function formatDate(d) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date)) return "—";
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function formatMoney(v) {
  const n = Number(v || 0);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function enderecoCompleto(c) {
  const parts = [];
  if (c.enderecoRua) parts.push(c.enderecoRua);
  if (c.enderecoBairro) parts.push(c.enderecoBairro);
  const cidadeUf = [c.enderecoCidade, c.enderecoUf].filter(Boolean).join(" - ");
  if (cidadeUf) parts.push(cidadeUf);
  if (c.enderecoCep) parts.push("CEP " + c.enderecoCep);
  return parts.join(", ") || "—";
}

// Excel serial date (days since 1899-12-30) -> JS Date (UTC)
export function excelDateToJs(serial) {
  if (serial == null || serial === "") return null;
  const n = Number(serial);
  if (!isFinite(n) || n <= 0) return null;
  const ms = Math.round((n - 25569) * 86400 * 1000); // 25569 = days between 1899-12-30 and 1970-01-01
  return new Date(ms);
}
