import "./globals.css";

export const metadata = {
  title: "Crachá BZ",
  description: "Sistema de crachás com QR, desconto e registro de presença",
  icons: { icon: "/logo.jpeg", apple: "/logo.jpeg" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0A6CD4",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
