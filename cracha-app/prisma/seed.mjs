import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// <projeto>/cracha-app/prisma/seed.mjs  ->  <projeto>/
const PROJECT_ROOT = path.resolve(__dirname, "../../");
const PUBLIC_FOTOS = path.resolve(__dirname, "../public/fotos");

// acha a 1a planilha (.xls/.xlsx) na pasta do projeto (nome pode ter acento NFD)
function findPlanilha() {
  const f = fs
    .readdirSync(PROJECT_ROOT)
    .filter((x) => /\.xlsx?$/i.test(x) && !x.startsWith("~$"))
    .sort();
  return f.length ? path.join(PROJECT_ROOT, f[0]) : null;
}

function norm(s) {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

function excelDateToJs(serial) {
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
  // ex: [RAZAO SOCIAL, NOME FANTASIA, "CENTRO DE CUSTO", CARGO]
  const razaoSocial = ls[0] || "Empresa";
  const cargo = ls[ls.length - 1] || null;
  const semCC = ls.filter((l) => norm(l) !== "CENTRO DE CUSTO");
  const nomeFantasia = semCC[1] && semCC[1] !== cargo ? semCC[1] : null;
  return { razaoSocial, nomeFantasia, cargo };
}

function parseColaborador(v) {
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

function findFoto(nome) {
  if (!fs.existsSync(PROJECT_ROOT)) return null;
  const files = fs
    .readdirSync(PROJECT_ROOT)
    .filter((f) => /\.(jpe?g|png)$/i.test(f));
  const alvo = norm(nome);
  for (const f of files) {
    const base = norm(f.replace(/\.(jpe?g|png)$/i, ""));
    if (!base) continue;
    if (alvo.includes(base) || base.includes(alvo.split(" ").slice(0, 2).join(" "))) {
      return f;
    }
  }
  return null;
}

function copyFoto(file, matricula) {
  fs.mkdirSync(PUBLIC_FOTOS, { recursive: true });
  const ext = path.extname(file);
  const dest = `${matricula || crypto.randomBytes(4).toString("hex")}${ext}`;
  fs.copyFileSync(path.join(PROJECT_ROOT, file), path.join(PUBLIC_FOTOS, dest));
  return `/fotos/${dest}`;
}

async function main() {
  const existing = await prisma.colaborador.count();
  if (existing > 0) {
    console.log(
      `Já existem ${existing} colaboradores. Seed ignorado (apague dev.db para refazer).`
    );
    return;
  }

  const XLS_PATH = findPlanilha();
  if (!XLS_PATH) {
    console.log(
      "Nenhuma planilha .xls/.xlsx na pasta. Pulando importação inicial.\n" +
        "Coloque a planilha na pasta e rode 'npm run db:seed', ou cadastre pelo admin."
    );
    // cria pelo menos um restaurante demo para o app funcionar
    const temRest = await prisma.restaurante.count();
    if (!temRest) {
      await prisma.restaurante.create({ data: { nome: "Restaurante Demo", login: "demo", pin: "1234" } });
      console.log("Restaurante demo -> login: demo / pin: 1234");
    }
    return;
  }
  console.log("Lendo planilha:", path.basename(XLS_PATH));

  const buf = fs.readFileSync(XLS_PATH);
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: "" });

  // acha a linha de cabeçalho (contém "Colaborador")
  let headerIdx = rows.findIndex((r) =>
    r.some((c) => norm(c).includes("COLABORADOR"))
  );
  if (headerIdx < 0) headerIdx = 0;
  const dataRows = rows.slice(headerIdx + 1).filter((r) => r.some((c) => String(c).trim()));

  // empresa (pega da primeira linha)
  const first = parseEmpresaCargo(dataRows[0]?.[0]);
  const empresa = await prisma.empresa.create({
    data: { razaoSocial: first.razaoSocial, nomeFantasia: first.nomeFantasia },
  });

  let n = 0;
  for (const r of dataRows) {
    const ec = parseEmpresaCargo(r[0]);
    const col = parseColaborador(r[1]);
    const end = parseEndereco(r[7]);
    const foto = findFoto(col.nome);

    await prisma.colaborador.create({
      data: {
        empresaId: empresa.id,
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
        fotoUrl: foto ? copyFoto(foto, col.matricula) : null,
        descontoPct: 0,
        qrToken: crypto.randomBytes(9).toString("hex"),
      },
    });
    n++;
    console.log(`+ ${col.nome} (${col.matricula || "s/ matrícula"})${foto ? " 📷" : ""}`);
  }

  // restaurante demo
  await prisma.restaurante.create({
    data: { nome: "Restaurante Demo", login: "demo", pin: "1234" },
  });

  console.log(`\nOK: empresa "${empresa.razaoSocial}", ${n} colaboradores.`);
  console.log("Restaurante demo -> login: demo / pin: 1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
