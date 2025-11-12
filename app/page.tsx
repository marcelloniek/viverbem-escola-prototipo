"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Play, Stethoscope, HeartPulse, BookOpen, Users, Home, Bell, Plus, Sparkles, ShieldCheck, NotebookPen, Phone, ChevronRight } from "lucide-react";

// -----------------------------
// Mock data
// -----------------------------
const topics = {
  psicopedagogia: [
    { group: "Processos de Aprendizagem", items: [
      "Dificuldades de aprendizagem", "Transtornos específicos", "Emoção e aprendizagem", "Inclusão escolar"
    ]},
    { group: "Estratégias e Desempenho", items: [
      "Atenção e concentração", "Motivação no estudo", "Rotina de estudos", "Memória e retenção", "Superação do fracasso", "Autonomia"
    ]},
    { group: "Ambientes e Relações", items: [
      "Adaptação à escola", "Escola–família", "Professor mediador", "Ambiente de estudo", "Aprendizagem cooperativa"
    ]},
    { group: "Linguagem e Avaliação", items: [
      "Leitura e interpretação", "Escrita e expressão", "Avaliação formativa", "Reforço positivo", "Plano individualizado"
    ]}
  ],
  psicologia: [
    { group: "Desenvolvimento e Identidade", items: [
      "Puberdade", "Autoestima e imagem", "Propósito de vida", "Espiritualidade"
    ]},
    { group: "Emoções e Comportamento", items: [
      "Reconhecer emoções", "Controle da raiva", "Estresse escolar", "Tomada de decisões"
    ]},
    { group: "Saúde Mental e Resiliência", items: [
      "Ansiedade", "Depressão", "Luto e perdas", "Resiliência"
    ]},
    { group: "Relações e Influências", items: [
      "Amizades e pertencimento", "Pais e autoridade", "Comunicação assertiva", "Bullying e cyberbullying", "Pressão de pares", "Redes sociais", "Sono e hábitos", "Esperança e motivação"
    ]}
  ],
  familia: [
    { group: "Comunicação e Vínculos", items: [
      "Comunicação afetiva", "Relação entre irmãos", "Exemplo dos pais", "Escuta ativa"
    ]},
    { group: "Disciplina e Desenvolvimento", items: [
      "Limites e disciplina", "Parentalidade consciente", "Autonomia dos filhos", "Valores e espiritualidade"
    ]},
    { group: "Desafios e Transtornos", items: [
      "TDAH", "TEA", "Ansiedade e depressão", "Bullying: como reagir"
    ]},
    { group: "Tecnologia e Saúde", items: [
      "Uso de telas e internet", "Prevenção às drogas", "Sexualidade", "Rotina saudável", "Saúde dos cuidadores", "Participação na escola", "Fé e propósito"
    ]}
  ]
};

const professionals = [
  { id: 1, name: "Dra. Ana Souza", role: "Pediatra", type: "medico" },
  { id: 2, name: "Dr. João Lima", role: "Nutricionista", type: "nutricionista" },
  { id: 3, name: "Dra. Carla Reis", role: "Psicóloga", type: "psicologo" },
  { id: 4, name: "Pr. Marcos Alves", role: "Aconselhamento espiritual", type: "espiritual" },
];

const healthSummary = {
  nome: "Aluno Exemplo",
  idade: 13,
  imc: 19.2,
  vacinasPendentes: ["HPV dose 2", "Influenza anual"],
  metas: ["Dormir 8h/noite", "Beber 6 copos de água", "Caminhar 30min 3x/semana"],
};

// -----------------------------
// UI helpers
// -----------------------------
function MobileShell({ children, tab, setTab }) {
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
          <Badge variant="secondary" className="rounded-full">beta</Badge>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Bottom Nav */}
        <div className="grid grid-cols-5 border-t bg-white">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-col items-center justify-center py-2 text-xs ${tab === t.key ? "text-sky-600" : "text-slate-500"}`}
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

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      )}
    </div>
  )
}

// -----------------------------
// Pages
// -----------------------------
function HomePage({ openSchedule }) {
  return (
    <div>
      <SectionTitle icon={Sparkles} title="Bem-vindo(a)" subtitle="Conteúdos e serviços para cuidar do corpo, mente e espírito." />
      <div className="px-4 grid gap-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Trilhas recomendadas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {[
              { title: "Ansiedade na escola", chip: "Psicologia" },
              { title: "Hábitos de estudo", chip: "Psicopedagogia" },
              { title: "Comunicação com seu filho", chip: "Família" },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{t.title}</p>
                  <p className="text-xs text-slate-500">Trilha rápida • 4 módulos</p>
                </div>
                <Badge>{t.chip}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Próximos passos de saúde</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="text-sm text-slate-700">IMC atual: <strong>{healthSummary.imc}</strong></div>
            <div className="text-sm text-slate-700">Vacinas pendentes: <strong>{healthSummary.vacinasPendentes.join(", ")}</strong></div>
            <div className="flex flex-wrap gap-2 mt-1">
              {healthSummary.metas.map((m, i) => (
                <Badge key={i} variant="secondary">{m}</Badge>
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
              <Button variant="secondary" className="flex-1" onClick={openSchedule}><CalendarIcon className="mr-2 h-4 w-4"/>Agendar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ContentPage() {
  const [tab, setTab] = useState("psico");
  return (
    <div>
      <SectionTitle icon={BookOpen} title="Conteúdos" subtitle="Explore por área e subgrupo temático." />
      <div className="px-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="psico">Psicoped.</TabsTrigger>
            <TabsTrigger value="psi">Psicologia</TabsTrigger>
            <TabsTrigger value="fam">Família</TabsTrigger>
          </TabsList>
          <TabsContent value="psico" className="mt-3">
            <TopicGroups data={topics.psicopedagogia} accent="from-sky-50 to-sky-100"/>
          </TabsContent>
          <TabsContent value="psi" className="mt-3">
            <TopicGroups data={topics.psicologia} accent="from-violet-50 to-violet-100"/>
          </TabsContent>
          <TabsContent value="fam" className="mt-3">
            <TopicGroups data={topics.familia} accent="from-emerald-50 to-emerald-100"/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TopicGroups({ data, accent }) {
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
                <Button size="sm" variant="secondary">Ver</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ServicesPage() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("psicologo");
  const pros = useMemo(() => professionals.filter(p => (type === "todos" ? true : p.type === type)), [type]);

  return (
    <div>
      <SectionTitle icon={Stethoscope} title="Serviços" subtitle="Agendamentos e carteira de saúde." />
      <div className="px-4 grid gap-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle className="text-base">Agendar atendimento</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label>Tipo de atendimento</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Escolha" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="psicologo">Psicológico</SelectItem>
                  <SelectItem value="medico">Médico</SelectItem>
                  <SelectItem value="nutricionista">Nutricional</SelectItem>
                  <SelectItem value="espiritual">Espiritual</SelectItem>
                  <SelectItem value="todos">Mostrar todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              {pros.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.role}</p>
                  </div>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">Agendar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo agendamento</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-3">
                        <div className="grid gap-1">
                          <Label>Profissional</Label>
                          <Input value={p.name + " — " + p.role} readOnly />
                        </div>
                        <div className="grid gap-1">
                          <Label>Data</Label>
                          <Input type="date" />
                        </div>
                        <div className="grid gap-1">
                          <Label>Horário</Label>
                          <Input type="time" />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Checkbox id="consent" />
                          <Label htmlFor="consent" className="text-sm">Li e aceito as regras de atendimento</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setOpen(false)}>
                          Confirmar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle className="text-base">Carteira de saúde</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div><strong>Aluno:</strong> {healthSummary.nome} ({healthSummary.idade} anos)</div>
            <div><strong>IMC:</strong> {healthSummary.imc}</div>
            <div><strong>Vacinas pendentes:</strong> {healthSummary.vacinasPendentes.join(", ")}</div>
            <div className="flex gap-2 pt-2">
              <Button variant="secondary"><NotebookPen className="h-4 w-4 mr-2"/>Atualizar dados</Button>
              <Button><Phone className="h-4 w-4 mr-2"/>Falar com suporte</Button>
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
          <CardHeader className="pb-2"><CardTitle className="text-base">Mentoria para Pais</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            <p className="text-sm text-slate-700">Encontro fechado mensal com especialistas. Próximo tema: <strong>Limites e disciplina positiva</strong>.</p>
            <div className="flex gap-2">
              <Button>Inscrever-se</Button>
              <Button variant="secondary">Ver cronograma</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle className="text-base">Conteúdos em destaque</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {["TDAH em casa e na escola", "Uso saudável de telas", "Comunicação afetiva"].map((t, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="font-medium">{t}</span>
                <Button size="sm" variant="secondary">Ver</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <div>
      <SectionTitle icon={ShieldCheck} title="Perfil" subtitle="Preferências e privacidade." />
      <div className="px-4 grid gap-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle className="text-base">Conta</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-1">
              <Label>Nome do aluno</Label>
              <Input defaultValue="Aluno Exemplo" />
            </div>
            <div className="grid gap-1">
              <Label>E-mail</Label>
              <Input defaultValue="aluno@escola.com" />
            </div>
            <div className="grid gap-1">
              <Label>Preferências de conteúdo</Label>
              <div className="flex flex-wrap gap-2">
                {["Psicologia", "Psicopedagogia", "Família"].map((p, i) => (
                  <Badge key={i} variant="secondary">{p}</Badge>
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
  const [tab, setTab] = useState("inicio");
  const [scheduleOpen, setScheduleOpen] = useState(false);

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
          {tab === "inicio" && <HomePage openSchedule={() => setScheduleOpen(true)} />}
          {tab === "conteudos" && <ContentPage />}
          {tab === "servicos" && <ServicesPage />}
          {tab === "familia" && <FamilyPage />}
          {tab === "perfil" && <ProfilePage />}
        </motion.div>
      </AnimatePresence>

      {/* Quick schedule dialog accessible from Home */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar atendimento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Label>Tipo</Label>
              <Select defaultValue="psicologo">
                <SelectTrigger><SelectValue placeholder="Escolha"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="psicologo">Psicológico</SelectItem>
                  <SelectItem value="medico">Médico</SelectItem>
                  <SelectItem value="nutricionista">Nutricional</SelectItem>
                  <SelectItem value="espiritual">Espiritual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label>Data</Label>
              <Input type="date" />
            </div>
            <div className="grid gap-1">
              <Label>Horário</Label>
              <Input type="time" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Checkbox id="consent2" />
              <Label htmlFor="consent2" className="text-sm">Concordo com os termos de atendimento</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setScheduleOpen(false)}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileShell>
  );
}


