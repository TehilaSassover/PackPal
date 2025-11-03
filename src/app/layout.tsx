import { Metadata } from "next";
export const metadata = {
  title: "PackPal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
