# TasksUFT — Sistema Gerenciador de Tarefas

Sistema web de gerenciamento de projetos e tarefas desenvolvido como Projeto Integrador III-B do curso de Análise e Desenvolvimento de Sistemas da PUC Goiás, em parceria com a Superintendência de Comunicação (SUCOM) da Universidade Federal do Tocantins (UFT).

---

## Sobre o Projeto

A SUCOM não dispõe de uma ferramenta centralizada para gerenciar suas demandas internas. Todo o acompanhamento de tarefas era feito via e-mail e WhatsApp, gerando perda de informações e dificuldade no controle de prazos. O TasksUFT foi desenvolvido para resolver esse problema, oferecendo um ambiente único e organizado para a equipe do setor.

---

## Funcionalidades

- Cadastro e autenticação de usuários
- Criação e gerenciamento de projetos com prazo
- Criação e acompanhamento de tarefas
- Quadro Kanban com drag-and-drop entre colunas
- Calendário de prazos com visualização por status
- Dashboard com resumo de projetos e tarefas
- Interface responsiva para desktop e mobile

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript |
| Build | Vite |
| Estilização | Tailwind CSS v4 |
| Roteamento | React Router v7 |
| Backend / Auth / DB | Supabase (PostgreSQL) |
| Drag and Drop | @dnd-kit |
| Ícones | Lucide React |

---

## Estrutura do Projeto
src/
├── components/
│   ├── domain/        # Componentes de domínio (TaskCard, KanbanColumn, ProjectCard)
│   └── ui/            # Componentes reutilizáveis (Button, Input, Modal, PageHeader)
├── contexts/          # AuthContext
├── hooks/             # Hooks customizados
├── layouts/           # AppLayout com sidebar responsiva
├── lib/               # Configuração do Supabase
├── pages/             # Dashboard, Projects, Kanban, Calendar, Login
├── router/            # Rotas e ProtectedRoute
├── services/          # projects.service.ts, tasks.service.ts
└── types/             # Tipagens globais

---

## Autor

Felipe Silva Leite
Análise e Desenvolvimento de Sistemas — PUC Goiás  
Projeto Integrador III-B — 2026

---

## Instituição Parceira

Superintendência de Comunicação (SUCOM)  
Universidade Federal do Tocantins (UFT)