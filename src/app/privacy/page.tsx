import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f8fbff] px-5 py-12">
      <article className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-blue-950/5 sm:p-10">
        <Link href="/" className="text-sm font-bold text-blue-700">
          ← Voltar
        </Link>
        <h1 className="mt-8 text-3xl font-black">Política de privacidade</h1>
        <p className="mt-4 leading-7 text-slate-600">
          As informações desta página serão preenchidas conforme a política
          institucional publicada pelo Rota Fácil. Durante a solicitação, os
          dados são utilizados exclusivamente para análise do pedido de adesão.
        </p>
        <p className="mt-4 leading-7 text-slate-600">
          Caso precise de esclarecimentos sobre o tratamento dos dados, utilize
          os canais institucionais do seu município.
        </p>
      </article>
    </main>
  );
}
