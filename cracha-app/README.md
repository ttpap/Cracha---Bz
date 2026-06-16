# Crachá Colaboradores

App web de crachás com QR para colaboradores de uma empresa que tem vários restaurantes.

- **Admin** cadastra colaboradores (manual ou importando `.xlsx`), define o **desconto** de cada um e gera o **crachá com QR**.
- **Restaurante** entra com login/PIN, **escaneia o QR**, vê quem é o colaborador + o desconto, e **registra a presença e o valor gasto** (já com desconto).

## Como rodar (primeira vez)

```bash
cd cracha-app
npm install
npm run setup     # cria o banco e importa a planilha + fotos da pasta acima
npm run dev       # abre em http://localhost:3000
```

> `npm run setup` lê automaticamente a 1ª planilha `.xls/.xlsx` da pasta do projeto
> (a pasta "Cracha Colaboradores da Bz") e casa as fotos pelo nome do arquivo.

Depois da 1ª vez, só `npm run dev`.

## Três acessos

- **Admin** → http://localhost:3000/admin · senha padrão: `admin123`
  Cadastra, define desconto, gera crachás, vê relatório de tudo.
- **Restaurante** → http://localhost:3000/restaurante · demo → login `demo` / PIN `1234`
  Escaneia o QR, vê a ficha + desconto, registra presença e valor.
- **Colaborador** → http://localhost:3000/colaborador · login: **matrícula + CPF**
  Vê o próprio crachá digital (QR no celular), desconto e histórico de gastos.

(troque a senha admin com a variável `ADMIN_PASSWORD`; troque/adicione restaurantes no painel admin.)

## Fluxo de uso

1. Admin abre **Colaboradores**, edita um colaborador e define o **% de desconto**.
2. Clica em **Crachá** → imprime ou salva PDF (tem o QR).
3. No restaurante, a pessoa entra com login/PIN → **Escanear crachá** → aponta a câmera no QR.
4. Aparece a ficha + desconto → digita o **valor já com desconto** → **Registrar**.
5. Admin acompanha tudo em **Relatório**.

## Importar mais colaboradores

Admin → **Importar** → envie um `.xls/.xlsx` no mesmo formato da ficha.
Matrículas já cadastradas são ignoradas (não duplica).

## Observações

- Banco local em **SQLite** (`prisma/dev.db`). Para publicar online (Vercel) depois,
  troca-se o datasource do Prisma para Postgres — o resto do código não muda.
- A leitura de QR pela câmera precisa de **HTTPS** no celular (no `localhost` do
  computador funciona em HTTP). Ao publicar, o HTTPS já vem pronto.
- Campos da ficha lidos: empresa, cargo, matrícula, CPF, e-mail, telefone,
  admissão, nascimento, endereço. O **desconto** é definido pelo admin no sistema.

## Stack

Next.js 15 · Prisma · SQLite · Tailwind · `qrcode` (gera) · `html5-qrcode` (lê) · `xlsx` (importa)
