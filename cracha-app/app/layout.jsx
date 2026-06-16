import "./globals.css";

export const metadata = {
  title: "Crachá Colaboradores",
  description: "Sistema de crachás com QR, desconto e registro de presença",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
