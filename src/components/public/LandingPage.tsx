import {
  ArrowRight,
  BarChart3,
  BellRing,
  Bot,
  BusFront,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  GraduationCap,
  Landmark,
  MapPinned,
  Route,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import {
  ApplicationEntryLink,
  PublicFooter,
  PublicHeader,
} from "@/components/public/PublicShell";

const features = [
  [
    Route,
    "Rotas mais organizadas",
    "Planeje percursos, pontos de embarque e instituições com uma visão única da operação.",
  ],
  [
    MapPinned,
    "Acompanhamento em tempo real",
    "Motoristas e gestores acompanham o andamento da viagem e identificam intercorrências com mais rapidez.",
  ],
  [
    BusFront,
    "Frota e motoristas",
    "Centralize veículos, documentos, habilitações e informações essenciais para a operação.",
  ],
  [
    UsersRound,
    "Alunos e presença",
    "Acompanhe estudantes, inscrições, check-in e a relação de cada aluno com sua viagem.",
  ],
  [
    BellRing,
    "Comunicação operacional",
    "Envie e receba avisos sobre início, cancelamento e alterações na viagem.",
  ],
  [
    BarChart3,
    "Relatórios para decidir",
    "Transforme o histórico da operação em informação útil para planejamento e prestação de contas.",
  ],
];

const problems = [
  {
    value: "64%",
    label: "das unidades com falta de zelo",
    detail:
      "O TCU encontrou problemas na prestação do serviço — uma falha que afeta diretamente a confiança das famílias.",
    source: "TCU · fiscalização nacional",
    href: "https://portal.tcu.gov.br/imprensa/noticias/tcu-verifica-transporte-escolar-deficiente-por-todo-o-brasil",
  },
  {
    value: "57%",
    label: "com falha de fiscalização municipal",
    detail:
      "Em mais da metade das unidades auditadas, faltava acompanhamento efetivo da execução do transporte.",
    source: "TCU · fiscalização nacional",
    href: "https://portal.tcu.gov.br/imprensa/noticias/tcu-verifica-transporte-escolar-deficiente-por-todo-o-brasil",
  },
  {
    value: "57%",
    label: "com rotas ou horários mal dimensionados",
    detail:
      "Planejamento ruim pode gerar atrasos, viagens desnecessárias, veículos lotados ou capacidade ociosa.",
    source: "TCU · fiscalização nacional",
    href: "https://portal.tcu.gov.br/imprensa/noticias/tcu-verifica-transporte-escolar-deficiente-por-todo-o-brasil",
  },
  {
    value: "50%",
    label: "com atrasos ou faltas habituais",
    detail:
      "Metade dos municípios auditados registrava inassiduidade ou impontualidade recorrente no serviço.",
    source: "TCU · fiscalização nacional",
    href: "https://portal.tcu.gov.br/imprensa/noticias/tcu-verifica-transporte-escolar-deficiente-por-todo-o-brasil",
  },
];

const impact = [
  {
    value: "5.570",
    label: "municípios no alcance do PNATE",
    detail:
      "O programa federal apoia estados, municípios e o Distrito Federal na oferta do transporte escolar rural.",
    source: "FNDE · Relatório de Gestão 2026",
    href: "https://www.gov.br/fnde/pt-br/acesso-a-informacao/transparencia-e-prestacao-de-contas/relatorio-de-gestao-1/relatorio-de-gestao-2026/programas-educacionais/pnate",
  },
  {
    value: "305 mil",
    label: "alunos beneficiados em 733 municípios",
    detail:
      "Resultado divulgado pelo FNDE para a ampliação do apoio ao transporte escolar.",
    source: "FNDE · Relatório de Gestão 2024",
    href: "https://www.gov.br/fnde/pt-br/acesso-a-informacao/transparencia-e-prestacao-de-contas/relatorio-de-gestao-1/relatorio-de-gestao-2024/desempenho-da-gestao/areas-finalisticas/transporte%20escolar%202023",
  },
  {
    value: "79%",
    label: "da fiscalização com falha de controle",
    detail:
      "O TCU apontou deficiência na avaliação efetiva dos serviços pelos conselhos de acompanhamento.",
    source: "TCU · FOC do transporte escolar",
    href: "https://portal.tcu.gov.br/imprensa/noticias/tcu-verifica-transporte-escolar-deficiente-por-todo-o-brasil",
  },
];

const municipalTools = [
  [
    "Dashboard operacional",
    "Uma visão única de rotas, viagens, frota, motoristas e alunos.",
    "/landing/administrativo/dashboard.jpeg",
  ],
  [
    "Análise preditiva",
    "Use o histórico para encontrar padrões e orientar os próximos ajustes.",
    "/landing/administrativo/predictive-analysis.jpeg",
  ],
  [
    "Mapa de calor",
    "Visualize a concentração de embarques por rota e horário.",
    "/landing/administrativo/heat-map.jpeg",
  ],
];

function ProductShot({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl shadow-blue-950/10 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={1366}
        height={768}
        className="h-full w-full object-cover object-top"
      />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff] text-slate-950">
      <PublicHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_10%,rgba(59,130,246,.18),transparent_34%),linear-gradient(180deg,#eff7ff_0%,#f8fbff_65%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:pb-28 lg:pt-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/75 px-3 py-1.5 text-xs font-bold text-blue-800 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Uma jornada mais conectada para todos
              </div>
              <h1 className="max-w-2xl text-4xl font-black leading-[1.04] tracking-[-.045em] text-slate-950 sm:text-6xl">
                Transporte escolar mais previsível para quem planeja. Mais
                tranquilo para quem espera.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                O Rota Fácil conecta prefeitura, motoristas, alunos e
                responsáveis em uma única experiência de gestão e
                acompanhamento.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ApplicationEntryLink className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-800 to-blue-500 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-700/20 transition hover:-translate-y-0.5">
                  Quero conhecer para meu município{" "}
                  <ArrowRight className="h-4 w-4" />
                </ApplicationEntryLink>
                <a
                  href="#students"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Sou aluno ou responsável
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Dados no mesmo lugar
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Mais transparência
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 rounded-[4rem] bg-blue-500/15 blur-3xl" />
              <div className="relative rounded-[2rem] border border-white/70 bg-white/80 p-3 shadow-2xl shadow-blue-950/20">
                <ProductShot
                  src="/landing/administrativo/dashboard.jpeg"
                  alt="Dashboard administrativo do Rota Fácil"
                  className="rounded-2xl"
                />
                <div className="absolute -bottom-7 -left-6 hidden w-52 rounded-2xl border border-blue-100 bg-white p-4 shadow-xl sm:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-700">
                    Visão integrada
                  </p>
                  <p className="mt-2 text-sm font-bold leading-5 text-slate-800">
                    Operação, alunos e inteligência no mesmo painel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-y border-slate-200/80 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 lg:px-8">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-blue-700" />
              <div>
                <p className="text-sm font-bold">Mais segurança</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Informações operacionais acessíveis a quem precisa.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <ClipboardCheck className="h-5 w-5 shrink-0 text-blue-700" />
              <div>
                <p className="text-sm font-bold">Mais controle</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Registros de viagens, alunos e ocorrências.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Bot className="h-5 w-5 shrink-0 text-blue-700" />
              <div>
                <p className="text-sm font-bold">Decisões apoiadas por IA</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Análises operacionais para encontrar padrões e riscos.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="challenges"
          className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
        >
          <div className="grid items-end gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-blue-700">
                O desafio é real
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Quando a gestão falha, o risco chega até o aluno.
              </h2>
            </div>
            <p className="max-w-2xl leading-7 text-slate-600">
              Não estamos falando apenas de planilhas desatualizadas. Auditorias
              públicas encontraram falhas que podem significar atraso, aluno sem
              atendimento, rota mal planejada e veículo sem acompanhamento. O
              Rota Fácil transforma esses pontos cegos em registros visíveis e
              ações acompanháveis.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((problem) => (
              <div
                key={problem.value + problem.label}
                className="rounded-2xl border border-red-100 bg-white p-5 shadow-[0_18px_45px_-35px_rgba(15,23,42,.5)]"
              >
                <p className="text-3xl font-black tracking-tight text-red-700">
                  {problem.value}
                </p>
                <p className="mt-2 text-sm font-bold text-slate-800">
                  {problem.label}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {problem.detail}
                </p>
                <a
                  href={problem.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900"
                >
                  {problem.source} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[11px] leading-5 text-slate-400">
            Os números são referências da fiscalização nacional do TCU e não
            representam indicadores do Rota Fácil nem projeções de resultado.
          </p>
        </section>
        <section className="bg-[#eaf4ff]">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="grid items-end gap-8 lg:grid-cols-[.85fr_1.15fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-blue-700">
                  Escala do desafio
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  Não é só uma rota. É uma rede pública inteira para coordenar.
                </h2>
              </div>
              <p className="max-w-2xl leading-7 text-slate-600">
                Esses dados ajudam a dimensionar por que planejamento, registro
                e transparência precisam caminhar juntos. O Rota Fácil organiza
                a rotina para que a equipe consiga agir antes que um problema
                vire uma reclamação, um atraso ou um risco.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {impact.map((item) => (
                <div
                  key={item.value}
                  className="rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_18px_45px_-35px_rgba(15,23,42,.5)]"
                >
                  <p className="text-3xl font-black tracking-tight text-blue-800">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-800">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {item.detail}
                  </p>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900"
                  >
                    {item.source} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="features" className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
                Uma plataforma para toda a operação
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Do planejamento ao embarque, tudo conversa.
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                Ferramentas conectadas para apoiar as equipes municipais e dar
                mais clareza a quem usa o transporte todos os dias.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(([Icon, title, description]) => (
                <div
                  key={title as string}
                  className="group rounded-2xl border border-white/10 bg-white/[.06] p-6 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[.1]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-cyan-300 transition group-hover:bg-cyan-300 group-hover:text-slate-950">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-bold">{title as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {description as string}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="prefectures"
          className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
                <Landmark className="h-6 w-6" />
              </div>
              <p className="mt-6 text-xs font-black uppercase tracking-[.2em] text-blue-700">
                Para prefeituras
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                A gestão municipal no controle da operação.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Centralize o que hoje fica em planilhas, mensagens e registros
                separados. Com dados de rotas, frota, alunos e viagens no mesmo
                lugar, a equipe ganha rastreabilidade para planejar, executar e
                prestar contas.
              </p>
              <div className="mt-7 grid gap-3">
                {[
                  "Cadastre e organize toda a rede de transporte",
                  "Acompanhe viagens, check-ins e ocorrências",
                  "Tome decisões com relatórios e inteligência operacional",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-semibold text-slate-700"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
              <ApplicationEntryLink className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-800 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-800/20 transition hover:-translate-y-0.5">
                Conhecer para meu município <ArrowRight className="h-4 w-4" />
              </ApplicationEntryLink>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {municipalTools.map(([title, description, src], index) => (
                <div
                  key={title}
                  className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-950/10 ${index === 0 ? "sm:col-span-2" : ""}`}
                >
                  <Image
                    src={src}
                    alt={title}
                    width={1354}
                    height={619}
                    className="h-auto w-full object-cover object-top"
                  />
                  <div className="p-4">
                    <p className="font-bold text-slate-900">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="intelligence"
          className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[.78fr_1.22fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-orange-600">
                Inteligência operacional
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                A IA ajuda a equipe a enxergar o que merece atenção.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                A análise preditiva interpreta o histórico disponível da
                operação para apontar recorrências, atrasos e padrões. O mapa de
                calor ajuda a visualizar pontos de maior movimento por rota e
                horário.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <Bot className="h-5 w-5 shrink-0 text-blue-700" />
                  <div>
                    <p className="text-sm font-bold">
                      Análise preditiva de rotas
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Interpretação automática associada à rota selecionada.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <MapPinned className="h-5 w-5 shrink-0 text-orange-600" />
                  <div>
                    <p className="text-sm font-bold">
                      Mapa de calor de embarque
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Visualização de concentração de pontos para apoiar
                      ajustes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              <ProductShot
                src="/landing/administrativo/predictive-analysis.jpeg"
                alt="Tela de análise preditiva do Rota Fácil"
                className="w-full"
              />
              <ProductShot
                src="/landing/administrativo/heat-map.jpeg"
                alt="Tela de mapa de calor do Rota Fácil"
                className="w-full"
              />
            </div>
          </div>
        </section>
        <section
          id="students"
          className="border-y border-slate-200/80 bg-white"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_.9fr]">
              <div className="grid grid-cols-2 gap-4">
                <ProductShot
                  src="/landing/app/trips.jpeg"
                  alt="Aplicativo com listagem de viagens"
                  className="col-span-2 max-h-[560px] sm:col-span-1"
                />
                <ProductShot
                  src="/landing/app/map.jpeg"
                  alt="Aplicativo com mapa da viagem em andamento"
                  className="mt-12 max-h-[560px] sm:col-span-1"
                />
              </div>
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-blue-700">
                  Para alunos e responsáveis
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  Mais tranquilidade antes, durante e depois da viagem.
                </h2>
                <p className="mt-4 leading-7 text-slate-600">
                  No aplicativo, o estudante consulta as viagens disponíveis,
                  confere rota, horário, veículo e acompanha o andamento da
                  operação pelo mapa.
                </p>
                <div className="mt-7 grid gap-3">
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Veja as viagens disponíveis
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Acompanhe o ônibus e a rota
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Receba avisos de início e cancelamento
                  </div>
                </div>
                <div className="mt-8 rounded-2xl bg-gradient-to-br from-blue-800 to-blue-500 p-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                      <BusFront className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold">Aplicativo Rota Fácil</p>
                      <p className="mt-1 text-xs text-blue-100">
                        Download para Android e iOS em breve.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="mt-5 w-full rounded-xl bg-white/15 px-4 py-3 text-sm font-bold text-blue-100"
                  >
                    Links de download serão disponibilizados em breve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
        >
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[.2em] text-blue-700">
              Como funciona
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Uma rotina mais simples para cada pessoa.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              [
                "01",
                "A prefeitura organiza",
                "Rotas, veículos, motoristas, instituições e alunos.",
              ],
              [
                "02",
                "O motorista executa",
                "A viagem começa e a equipe acompanha a operação.",
              ],
              [
                "03",
                "O aluno acompanha",
                "O aplicativo mostra viagens, horários, mapa e avisos.",
              ],
              [
                "04",
                "A gestão aprende",
                "Históricos e IA apoiam os próximos ajustes.",
              ],
            ].map(([number, title, description]) => (
              <div key={number} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-sm font-black text-white">
                  {number}
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
          <div className="grid items-center gap-8 rounded-[2rem] bg-blue-700 px-7 py-10 text-white sm:px-12 lg:grid-cols-[1fr_auto] lg:py-14">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-blue-200">
                Para gestores municipais
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                Seu município está pronto para transformar o transporte escolar?
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-blue-100">
                Conheça a plataforma e inicie uma conversa sobre a adesão do seu
                município.
              </p>
            </div>
            <ApplicationEntryLink className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-blue-800 transition hover:bg-blue-50">
              Solicitar adesão <ArrowRight className="h-4 w-4" />
            </ApplicationEntryLink>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
