"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Play,
  Stethoscope,
  HeartPulse,
  BookOpen,
  Users,
  Home,
  Sparkles,
  ShieldCheck,
  NotebookPen,
  Phone,
  ExternalLink,
} from "lucide-react";

// URL EXTERNA PARA ATENDIMENTOS
const EXTERNAL_SCHEDULING_URL = "https://minha-plataforma-de-atendimentos.com";

// -----------------------------
// Tipos
// -----------------------------
type MobileShellProps = {
  children: React.ReactNode;
  tab: string;
  setTab: (key: string) => void;
};

type SectionTitleProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle?: string;
};

type TopicGroup = { group: string; items: string[] };
type TopicGroupsProps = { data: TopicGroup[]; accent: string };

type Professional = {
  id: number;
  name: string;
  role: string;
  type: "medico" | "nutricionista" | "psicologo" | "espiritual";
};

type HealthSummary = {
  nome: string;
  idade: number;
  imc: number;
  vacinasPendentes: string[];
  metas: string[];
};

type HomePageProps = { trilhasDestaque: Trilha[]; openExternalScheduling: () => void };

type Rede = {
  id: string;
  nome: string;
};

type Escola = {
  id: string;
  nome: string;
  redeId: string;
};

type Conteudo = {
  id: string;
  titulo: string;
  area: "psicopedagogia" | "psicologia" | "familia";
  subgrupo: string;
  descricao: string;
  tipo: "video" | "texto";
  seriesAlvo: string[];
  redesAlvo: string[];
  escolasAlvo?: string[];
};

type Trilha = {
  id: string;
  titulo: string;
  descricao: string;
  thumbnailEmoji: string; // para o protótipo vamos usar um emoji como “imagem”
  conteudosIds: string[];
  seriesAlvo: string[];
  redesAlvo: string[];
  escolasAlvo?: string[];
  destaque: boolean;
  destaqueInicio?: string;
  destaqueFim?: string;
};

type UserContext = {
  alunoNome: string;
  serie: string;
  escolaId: string;
  redeId: string;
};

// -----------------------------
// Mock data
// -----------------------------
const redes: Rede[] = [
  { id: "rede1", nome: "Rede ViverBem" },
];

const escolas: Escola[] = [
  { id: "escola1", nome: "Escola ViverBem Central", redeId: "rede1" },
];

const userContext: UserContext = {
  alunoNome: "Aluno Exemplo",
  serie: "8º ano",
  escolaId: "escola1",
  redeId: "rede1",
};

const conteudos: Conteudo[] = [
  {
    id: "c1",
    titulo: "Ansiedade na Escola",
    area: "psicologia",
    subgrupo: "Saúde Mental e Resiliência",
    descricao: "Como lidar com pensamentos acelerados e medo de falhar.",
    tipo: "video",
    seriesAlvo: ["7º ano", "8º ano", "9º ano"],
    redesAlvo: ["rede1"],
  },
  {
    id: "c2",
    titulo: "Hábitos de Estudo",
    area: "psicopedagogia",
    subgrupo: "Estratégias e Desempenho",
    descricao: "Organização, foco e método para aprender melhor.",
    tipo: "video",
    seriesAlvo: ["6º ano", "7º ano", "8º ano", "9º ano"],
    redesAlvo: ["rede1"],
  },
  {
    id: "c3",
    titulo: "Comunicação com seus Pais",
    area: "familia",
    subgrupo: "Comunicação e Vínculos",
    descricao: "Como abrir o coração e ser ouvido em casa.",
    tipo: "texto",
    seriesAlvo: ["8º ano", "9º ano"],
    redesAlvo: ["rede1"],
  },
  {
    id: "c4",
    titulo: "Autoestima e Imagem Corporal",
    area: "psicologia",
    subgrupo: "Desenvolvimento e Identidade",
    descricao: "Aprendendo a se enxergar com carinho e respeito.",
    tipo: "video",
    seriesAlvo: ["7º ano", "8º ano", "9º ano"],
    redesAlvo: ["rede1"],
  },
];

const trilhas: Trilha[] = [
  {
    id: "t1",
    titulo: "Trilha da Ansiedade Saudável",
    descricao: "3 passos para entender, nomear e cuidar da ansiedade.",
    thumbnailEmoji: "🧠",
    conteudosIds: ["c1", "c4"],
    seriesAlvo: ["8º ano", "9º ano"],
    redesAlvo: ["rede1"],
    destaque: true,
  },
  {
    id: "t2",
    titulo: "Trilha de Hábitos de Estudo",
    descricao: "Organização, rotina e foco para estudar melhor.",
    thumbnailEmoji: "📚",
    conteudosIds: ["c2"],
    seriesAlvo: ["6º ano", "7º ano", "8º ano"],
    redesAlvo: ["rede1"],
    destaque: true,
  },
  {
    id: "t3",
    titulo: "Trilha Família em Diálogo",
    descricao: "Conteúdos para melhorar a comunicação em casa.",
    thumbnailEmoji: "👨‍👩‍👧",
    conteudosIds: ["c3"],
    seriesAlvo: ["8º ano", "9º ano"],
    redesAlvo: ["rede1"],
    destaque: false,
  },
];

const topics = {
  psicopedagogia: [
    {
      group: "Processos de Aprendizagem",
      items: [
        "Dificuldades de aprendizagem",
        "Transtornos específicos",
        "Emoção e aprendizagem",
        "Inclusão escolar",
      ],
    },
    {
      group: "Estratégias e Desempenho",
      items: [
        "Atenção e concentração",
        "Motivação no estudo",
        "Rotina de estudos",
        "Memória e retenção",
        "Superação do fracasso",
        "Autonomia",
      ],
    },
  ],
  psicologia: [
    {
      group: "Desenvolvimento e Identidade",
      items: ["Puberdade", "Autoestima e imagem", "Propósito de vida", "Espiritualidade"],
    },
    {
      group: "Emoções e Comportamento",
      items: [
        "Reconhecer emoções",
        "Controle da raiva",
        "Estresse escolar",
        "Tomada de decisões",
      ],
    },
  ],
  familia: [
    {
      group: "Comunicação e Vínculos",
      items: ["Comunicação afetiva", "Relação entre irmãos", "Exemplo dos pais", "Escuta ativa"],
    },
    {
      group: "Disciplina e Desenvolvimento",
      items: [
        "Limites e disciplina",
        "Parentalidade consciente",
        "Autonomia dos filhos",
        "Valores e espiritualidade",
      ],
    },
  ],
};

const professionals: Professional[] = [
  { id: 1, name: "Dra. Ana Souza", role: "Pediatra", type: "medico" },
  { id: 2, name: "Dr. João Lima", role: "Nutricionista", type: "nutricionista" },
  { id: 3, name: "Dra. Carla Reis", role: "Psicóloga", type: "psicologo" },
  { id: 4, name: "Pr. Marcos Alves", role: "Aconselhamento espiritual", type: "espiritual" },
];

const healthSummary: HealthSummary = {
  nome: "Aluno Exemplo",
  idade: 13,
  imc: 19.2,
  vacinasPendentes: ["HPV dose 2", "Influenza anual"],
  metas: ["Dormir 8h/noite", "Beber 6 copos de água", "Caminhar 30min 3x/semana"],
};

// -----------------------------
// UI helpers
// -----------------------------
function MobileShell({ children, tab, setTab }: MobileShellProps) {
  const tabs = [
    { key: "inicio", label: "Início", icon: <Home className="h-5 w-5" /> },
    { key: "conteudos", label: "Conteúdos", icon: <BookOpen className="h-5 w-5" /> },
    { key: "servicos", label: "Serviços", icon: <Stethoscope className="h-5 w-5" /> },
    { key: "familia", label: "Família", icon: <Users className="h-5 w-5" /> },
    { key: "perfil", label: "Perfil", icon: <ShieldCheck className="h-5 w-5" /> },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-start justify-center p-4">
      <div className="w-[390px] min-h-[730px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-white/80 backdrop-blur flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5" />
            <span className="font-semibold">ViverBem Escola</span>
          </div>
          <Badge variant="secondary" className="rounded-full">
            beta
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Bottom Nav */}
        <div className="grid grid-cols-5 border-t bg-white">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-col items-center justify-center py-2 text-xs ${
                tab === t.key ? "text-sky-600" : "text-slate-500"
              }`}
            >
              {t.icon}
              <span className="mt-1">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: SectionTitleProps) {
  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}

// -----------------------------
// Helpers de filtro de trilhas/conteúdos
// -----------------------------
function filtrarTrilhasParaUsuario(all: Trilha[], ctx: UserContext): Trilha[] {
  return all.filter((t) => {
    const serieOK = t.seriesAlvo.includes(ctx.serie);
    const redeOK = t.redesAlvo.length === 0 || t.redesAlvo.includes(ctx.redeId);
    const escolaOK =
      !t.escolasAlvo || t.escolasAlvo.length === 0 || t.escolasAlvo.includes(ctx.escolaId);
    return serieOK && redeOK && escolaOK;
  });
}

function filtrarConteudosParaUsuario(all: Conteudo[], ctx: UserContext): Conteudo[] {
  return all.filter((c) => {
    const serieOK = c.seriesAlvo.includes(ctx.serie);
    const redeOK = c.redesAlvo.length === 0 || c.redesAlvo.includes(ctx.redeId);
    const escolaOK =
      !c.escolasAlvo || c.escolasAlvo.length === 0 || c.escolasAlvo.includes(ctx.escolaId);
    return serieOK && redeOK && escolaOK;
  });
}

// -----------------------------
// Pages
// -----------------------------
function HomePage({ trilhasDestaque, openExternalScheduling }: HomePageProps) {
  return (
    <div>
      <SectionTitle
        icon={Sparkles}
        title="Bem-vindo(a)"
        subtitle="Trilhas e saúde para cuidar do corpo, mente e espírito."
      />
      <div className="px-4 grid gap-3">
        {/* Trilhas em destaque */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Trilhas em destaque</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {trilhasDestaque.length === 0 && (
              <p className="text-sm text-slate-500">
                Nenhuma trilha em destaque no momento. Explore a aba Conteúdos.
              </p>
            )}
            {trilhasDestaque.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <div className="text-2xl">{t.thumbnailEmoji}</div>
                  <div>
                    <p className="font-medium text-slate-800">{t.titulo}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{t.descricao}</p>
                  </div>
                </div>
                <Badge variant="secondary">Trilha</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Resumo saúde */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Próximos passos de saúde</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="text-sm text-slate-700">
              IMC atual: <strong>{healthSummary.imc}</strong>
            </div>
            <div className="text-sm text-slate-700">
              Vacinas pendentes: <strong>{healthSummary.vacinasPendentes.join(", ")}</strong>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {healthSummary.metas.map((m, i) => (
                <Badge key={i} variant="secondary">
                  {m}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex-1">Atualizar carteira</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Atualizar carteira de saúde</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3">
                    <Label htmlFor="vacina">Vacina</Label>
                    <Input id="vacina" placeholder="Ex.: Influenza 2025" />
                    <Label htmlFor="imc">IMC</Label>
                    <Input id="imc" placeholder="Ex.: 19.2" />
                  </div>
                  <DialogFooter>
                    <Button>Salvar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={openExternalScheduling}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Atendimentos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TopicGroups({ data, accent }: TopicGroupsProps) {
  return (
    <div className="grid gap-3">
      {data.map((g, idx) => (
        <Card key={idx} className={`rounded-2xl bg-gradient-to-br ${accent}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{g.group}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {g.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span>{it}</span>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => alert("Tela de conteúdo detalhado em desenvolvimento.")}
                >
                  Ver
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type ContentPageProps = {
  trilhasUsuario: Trilha[];
};

function ContentPage({ trilhasUsuario }: ContentPageProps) {
  const [tab, setTab] = useState<string>("trilhas");

  return (
    <div>
      <SectionTitle
        icon={BookOpen}
        title="Conteúdos"
        subtitle="Explore trilhas e temas por área."
      />
      <div className="px-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="trilhas">Trilhas</TabsTrigger>
            <TabsTrigger value="psico">Psicoped.</TabsTrigger>
            <TabsTrigger value="psi">Psicologia</TabsTrigger>
            <TabsTrigger value="fam">Família</TabsTrigger>
          </TabsList>

          {/* Trilhas */}
          <TabsContent value="trilhas" className="mt-3">
            <div className="grid grid-cols-2 gap-3">
              {trilhasUsuario.map((t) => (
                <Card key={t.id} className="rounded-2xl px-2 pt-2 pb-3">
                  <div className="text-3xl mb-1">{t.thumbnailEmoji}</div>
                  <p className="text-sm font-semibold leading-snug">{t.titulo}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{t.descricao}</p>
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => alert("Tela da trilha detalhada em desenvolvimento.")}
                  >
                    Ver trilha
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Psico */}
          <TabsContent value="psico" className="mt-3">
            <TopicGroups data={topics.psicopedagogia} accent="from-sky-50 to-sky-100" />
          </TabsContent>

          {/* Psicologia */}
          <TabsContent value="psi" className="mt-3">
            <TopicGroups data={topics.psicologia} accent="from-violet-50 to-violet-100" />
          </TabsContent>

          {/* Família */}
          <TabsContent value="fam" className="mt-3">
            <TopicGroups data={topics.familia} accent="from-emerald-50 to-emerald-100" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ServicesPage() {
  const handleOpenExternal = () => {
    if (typeof window !== "undefined") {
      window.open(EXTERNAL_SCHEDULING_URL, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div>
      <SectionTitle
        icon={Stethoscope}
        title="Serviços"
        subtitle="Acesse os atendimentos pela plataforma parceira."
      />
      <div className="px-4 grid gap-3">
        {/* bloco explicativo */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Atendimentos online</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-slate-700">
            <p>
              Os atendimentos médicos, psicológicos, nutricionais e espirituais são realizados em
              uma plataforma externa segura, já em funcionamento.
            </p>
            <p>
              Para agendar, clique no botão abaixo. Você será redirecionado para o ambiente de
              teleatendimento, onde fará login e escolherá o melhor horário.
            </p>
            <Button className="mt-2" onClick={handleOpenExternal}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Acessar plataforma de atendimentos
            </Button>
          </CardContent>
        </Card>

        {/* Carteira de saúde resumo (igual antes) */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Carteira de saúde</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div>
              <strong>Aluno:</strong> {healthSummary.nome} ({healthSummary.idade} anos)
            </div>
            <div>
              <strong>IMC:</strong> {healthSummary.imc}
            </div>
            <div>
              <strong>Vacinas pendentes:</strong> {healthSummary.vacinasPendentes.join(", ")}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="secondary">
                <NotebookPen className="h-4 w-4 mr-2" />
                Atualizar dados
              </Button>
              <Button>
                <Phone className="h-4 w-4 mr-2" />
                Falar com suporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FamilyPage() {
  return (
    <div>
      <SectionTitle icon={Users} title="Família" subtitle="Mentoria mensal e conteúdos para pais." />
      <div className="px-4 grid gap-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Mentoria para Pais</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <p className="text-sm text-slate-700">
              Encontro fechado mensal com especialistas. Próximo tema:{" "}
              <strong>Limites e disciplina positiva</strong>.
            </p>
            <div className="flex gap-2">
              <Button>Inscrever-se</Button>
              <Button variant="secondary">Ver cronograma</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Conteúdos em destaque</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {["TDAH em casa e na escola", "Uso saudável de telas", "Comunicação afetiva"].map(
              (t, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t}</span>
                  <Button size="sm" variant="secondary">
                    Ver
                  </Button>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfilePage() {
  const escola = escolas.find((e) => e.id === userContext.escolaId);
  const rede = redes.find((r) => r.id === userContext.redeId);

  return (
    <div>
      <SectionTitle icon={ShieldCheck} title="Perfil" subtitle="Preferências e privacidade." />
      <div className="px-4 grid gap-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Conta</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-1">
              <Label>Nome do aluno</Label>
              <Input defaultValue={userContext.alunoNome} />
            </div>
            <div className="grid gap-1">
              <Label>Série escolar</Label>
              <Input defaultValue={userContext.serie} />
            </div>
            <div className="grid gap-1">
              <Label>Escola</Label>
              <Input defaultValue={escola?.nome ?? ""} />
            </div>
            <div className="grid gap-1">
              <Label>Rede escolar</Label>
              <Input defaultValue={rede?.nome ?? ""} />
            </div>
            <div className="grid gap-1">
              <Label>Preferências de conteúdo</Label>
              <div className="flex flex-wrap gap-2">
                {["Psicologia", "Psicopedagogia", "Família"].map((p, i) => (
                  <Badge key={i} variant="secondary">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Salvar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// -----------------------------
// Main export (App)
// -----------------------------
export default function App() {
  const [tab, setTab] = useState<string>("inicio");

  const trilhasUsuario = useMemo(
    () => filtrarTrilhasParaUsuario(trilhas, userContext),
    []
  );

  const trilhasDestaque = useMemo(
    () => trilhasUsuario.filter((t) => t.destaque),
    [trilhasUsuario]
  );

  const handleOpenExternalScheduling = () => {
    if (typeof window !== "undefined") {
      window.open(EXTERNAL_SCHEDULING_URL, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <MobileShell tab={tab} setTab={setTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "inicio" && (
            <HomePage
              trilhasDestaque={trilhasDestaque}
              openExternalScheduling={handleOpenExternalScheduling}
            />
          )}
          {tab === "conteudos" && <ContentPage trilhasUsuario={trilhasUsuario} />}
          {tab === "servicos" && <ServicesPage />}
          {tab === "familia" && <FamilyPage />}
          {tab === "perfil" && <ProfilePage />}
        </motion.div>
      </AnimatePresence>
    </MobileShell>
  );
}
