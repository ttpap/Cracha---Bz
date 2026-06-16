import * as XLSX from "xlsx";

export function norm(s) {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

export function excelDateToJs(serial) {
  const n = Number(serial);
  if (!isFinite(n) || n <= 0) return null;
  return new Date(Math.round((n - 25569) * 86400 * 1000));
}

function lines(v) {
  return String(v || "")
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseEmpresaCargo(v) {
  const ls = lines(v);
  const razaoSocial = ls[0] || "Empresa";
  const cargo = ls[ls.length - 1] || null;
  const semCC = ls.filter((l) => norm(l) !== "CENTRO DE CUSTO");
  const nomeFantasia = semCC[1] && semCC[1] !== cargo ? semCC[1] : null;
  return { razaoSocial, nomeFantasia, cargo };
}

function parseColaboradorCell(v) {
  const ls = lines(v);
  const nome = ls[0] || "Sem nome";
  const m = String(v || "").match(/\((\d+)\)/);
  return { nome, matricula: m ? m[1] : null };
}

function parseEndereco(v) {
  const ls = lines(v);
  const rua = ls[0] || null;
  const bairro = ls[1] || null;
  let cidade = null,
    uf = null,
    cep = null;
  for (const l of ls.slice(2)) {
    const cepM = l.match(/\d{2}\.?\d{3}-?\d{3}/);
    if (cepM) {
      cep = cepM[0].replace(/[^\d-]/g, "");
      continue;
    }
    const ufM = l.match(/^(.*)-([A-Za-z]{2})$/);
    if (ufM) {
      cidade = ufM[1].trim();
      uf = ufM[2].toUpperCase();
    }
  }
  return { rua, bairro, cidade, uf, cep };
}

/**
 * Recebe um Buffer/ArrayBuffer de .xls/.xlsx no layout da ficha
 * e devolve { empresa, colaboradores: [...] }
 */
export function parsePlanilhaBuffer(buf) {
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: "" });

  let headerIdx = rows.findIndex((r) =>
    r.some((c) => norm(c).includes("COLABORADOR"))
  );
  if (headerIdx < 0) headerIdx = 0;
  const dataRows = rows
    .slice(headerIdx + 1)
    .filter((r) => r.some((c) => String(c).trim()));

  const first = parseEmpresaCargo(dataRows[0]?.[0]);
  const empresa = { razaoSocial: first.razaoSocial, nomeFantasia: first.nomeFantasia };

  const colaboradores = dataRows.map((r) => {
    const ec = parseEmpresaCargo(r[0]);
    const col = parseColaboradorCell(r[1]);
    const end = parseEndereco(r[7]);
    return {
      matricula: col.matricula,
      nome: col.nome,
      cpf: String(r[2] || "").trim() || null,
      email: String(r[3] || "").trim() || null,
      telefone: lines(r[4])[0] || null,
      cargo: ec.cargo,
      centroCusto: "CENTRO DE CUSTO",
      admissao: excelDateToJs(r[5]),
      nascimento: excelDateToJs(r[6]),
      enderecoRua: end.rua,
      enderecoBairro: end.bairro,
      enderecoCidade: end.cidade,
      enderecoUf: end.uf,
      enderecoCep: end.cep,
    };
  });

  return { empresa, colaboradores };
}
