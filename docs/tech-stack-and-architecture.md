# Tech Stack, Architecture & OpenCode Directives
**Projeto:** Sistema Montador Lucrativo (PWA)
**IDE de Desenvolvimento:** Antigravity (OpenCode Agent com modelo Big Pickle)

---

## 1. Stack Tecnológico Selecionado

* **Core Framework:** React 18+ com Vite (Build rápido, leve e sem overhead de SSR para PWA).
* **Estilização:** Tailwind CSS (Com tokens de cores industriais DeWalt #FFC200 e Zinc Dark #121214).
* **Ícones:** Lucide React (lucide-react).
* **Backend & Auth:** Firebase (v10+ SDK Modular): Auth, Firestore, Storage.
* **Gerador de PDF:** jspdf e jspdf-autotable (Execução client-side em formato vertical mobile-first).
* **Suporte PWA:** vite-plugin-pwa (Service Workers, Web App Manifest, offline caching).
* **Gerenciamento de Estado:** React Context API + LocalStorage para estados locais velozes.

---

## 2. Estrutura de Pastas do Projeto (Project Tree)

O agente OpenCode/Big Pickle deve seguir rigorosamente a estrutura abaixo:

/
├── docs/                      # Documentação técnica do projeto
│   ├── prd.md
│   ├── ui-ux-spec.md
│   ├── database-schema.md
│   └── tech-stack-and-architecture.md
├── public/                    # Assets estáticos, ícones PWA, logo
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── assets/                # Imagens e marcas d'água
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/                # Botões, inputs, cards, modais (Tailwind)
│   │   ├── layout/            # Header, BottomNav, Sidebar Admin
│   │   ├── budget/            # Módulo de orçamentos (barra de busca, listas)
│   │   ├── finance/           # Painel de metas e MEI
│   │   └── pdf/               # Geradores e templates de PDF
│   ├── context/               # AuthContext, AppDataContext
│   ├── hooks/                 # Custom React Hooks (useFirestore, useOffline)
│   ├── services/              # Conexões externas (firebase.js, whatsapp.js)
│   ├── utils/                 # Máscaras de moeda, cálculos de precificação, datas
│   ├── views/                 # Telas principais (Tabs do App)
│   │   ├── SettingsView.jsx
│   │   ├── ClientsView.jsx
│   │   ├── NewBudgetView.jsx
│   │   ├── HistoryView.jsx
│   │   ├── FinanceView.jsx
│   │   └── RadarView.jsx
│   ├── App.jsx                # Roteamento e gerenciador de abas
│   └── main.jsx               # Entry point
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json

---

## 3. Diretrizes de Código para o Agente IA (Big Pickle Guidelines)

Ao implementar funcionalidades neste repositório, o agente de IA deve seguir estas regras:

1. **Modularidade por Componente:** Nunca crie arquivos monolíticos de mais de 300 linhas. Separe lógicas de modais, tabelas e cards em subcomponentes dentro de src/components/.
2. **Tratamento de Erros Offline:** Toda operação com o Firebase deve ser envolvida em blocos try/catch. Se o dispositivo estiver sem internet, o sistema deve gravar no estado local/IndexedDB e informar suavemente o usuário com um aviso "Salvo offline".
3. **Máscaras e Formatação de Moeda:** Utilize as funções utilitárias de src/utils/formatters.js para formatar R$ 0,00 e máscaras de CPF/CNPJ/Telefone nos inputs. Nunca faça formatação manual repetida nos componentes.
4. **Respeito aos Tokens DeWalt:** Utilize as classes configuradas no tailwind.config.js (Ex: bg-dewalt-yellow, bg-zinc-dark, text-slate-light).
5. **PDF Vertical Mobile-First:** O gerador de PDF em src/components/pdf/ deve usar cálculo dinâmico de coordenadas no jspdf para gerar páginas ajustadas para telas de celular (largura proporcional a 108mm por 192mm ou vertical contínuo).