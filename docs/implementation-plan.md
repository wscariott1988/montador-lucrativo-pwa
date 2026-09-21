# Implementation Plan & Execution Steps
**Projeto:** Sistema Montador Lucrativo (PWA)
**Agente:** OpenCode / Big Pickle

Este documento define a ordem estrita de execução para o desenvolvimento do aplicativo. O agente de IA deve completar uma fase 100% antes de iniciar a próxima. Ao final de cada fase, o agente deve confirmar se o código está rodando sem erros.

---

## FASE 1: Setup da Fundação (Infraestrutura)
1. Iniciar o projeto com Vite + React + JavaScript/TypeScript.
2. Instalar e configurar o TailwindCSS com as cores DeWalt definidas no `ui-ux-spec.md`.
3. Configurar a estrutura de pastas conforme o `tech-stack-and-architecture.md`.
4. Instalar o `lucide-react` para os ícones.
5. Criar o arquivo de configuração do Firebase (`src/services/firebase.js`) e configurar Auth e Firestore básicos.
6. **Teste da Fase 1:** A aplicação deve rodar um "Hello World" com uma cor do Tailwind funcionando.

## FASE 2: Roteamento, Layout Base e Autenticação
1. Criar as rotas da aplicação (React Router ou roteamento condicional simples).
2. Construir a tela de Login (com e-mail e senha).
3. Construir o Layout Principal (`AppLayout.jsx`), que inclui a `Bottom Navigation Bar` com as 5 abas.
4. Criar views vazias apenas com os títulos para: Ajustes, Clientes, Novo Orçamento, Histórico, Finanças.
5. **Teste da Fase 2:** O usuário consegue logar (ou criar conta) e navegar entre as 5 abas pelo menu inferior.

## FASE 3: Módulo de Configurações e Offline-First
1. Implementar a lógica de ativação do modo Offline do Firestore (IndexedDB).
2. Desenvolver a view `SettingsView.jsx` com os inputs de Custos, Pró-Labore, Impostos e cadastro de Ferramentas.
3. Criar os Hooks/Contextos para buscar os dados do usuário do Firestore (`/users/{uid}`) e salvar automaticamente no LocalStorage.
4. **Teste da Fase 3:** O usuário altera o "Valor do DAS" e o banco de dados Firebase atualiza. Desligando a internet, os dados continuam na tela.

## FASE 4: O Coração - Módulo de Finanças e Clientes
**STATUS: CONCLUÍDA**
1. Desenvolver a view `ClientsView.jsx` (CRUD de clientes salvos em `/users/{uid}/clientes`).
2. Desenvolver a view `FinanceView.jsx` baseada no design DeWalt.
3. Implementar a barra de progresso do MEI e o cálculo da Meta Mensal baseada nos custos (definidos na Fase 3).
4. Implementar botões de adicionar Despesas e Entradas Avulsas.
5. **Teste da Fase 4:** Cadastrar uma receita e ver a barra de "Faturado do Mês" e a meta atualizarem em tempo real.

> Notas de implementação: consultas financeiras sempre filtradas por `data >= inicio` e `data <= fim`
> do mês/ano (Free Shield, sem download do histórico). Lançamentos em `/despesas` e `/receitas_avulsas`
> (schema). Painel anual soma receitas avulsas + orçamentos pagos do ano; limite MEI R$ 81.000,00.

## FASE 5: Motor de Vendas - Orçamento e PDF
**STATUS: CONCLUÍDA**
1. Construir a view `NewBudgetView.jsx` como um formulário longo (mobile-first).
2. Implementar a busca/autocomplete do Catálogo de Serviços e Peças.
3. Implementar o cálculo dinâmico de `Total Geral` (Serviços + Peças + Deslocamento - Descontos).
4. Integrar o `jspdf` para gerar a Proposta em PDF diretamente no navegador (Client-side) em formato otimizado para celular.
5. Criar a geração do link do WhatsApp com o resumo do orçamento.
6. **Teste da Fase 5:** Preencher um orçamento inteiro, ver o cálculo final bater perfeitamente e baixar o PDF legível.

> Notas: `firestore.rules` criado na raiz (isolamento `/users/{uid}`). jsPDF isolado em chunk
> próprio (pdf-*.js) para nao inflar o cache do PWA. `valorHoraCalculado` congelado em
> snapshot no orcamento (`valorHoraAplicado`). WhatsApp = copia formatada para area de
> transferencia (clipboard + fallback).

## FASE 6: Histórico e PWA
**STATUS: CONCLUÍDA**
1. Desenvolver a view `HistoryView.jsx` que lista os orçamentos salvos.
2. Implementar botões de ação no card do histórico (PDF, Waze/Maps, Marcar Pago, Apagar).
3. Configurar o plugin PWA (`vite-plugin-pwa`) para gerar o `manifest.json` e o service worker, permitindo a instalação do app na tela inicial do celular.
4. **Teste da Fase 6:** Instalar o app no celular/simulador, desligar a internet, criar um orçamento e ver ele ir para a fila de sincronização.

> Notas: leitura paginada via `historyService.useHistory` (orderBy createdAt desc +
> limit(20) + cursor startAfter). `saveOrcamento` grava `snapshot` congelado no documento
> para o PDF regenerado ser idêntico (sem recalcular preços). Ação "Refazer PDF" usa
> `buildSnapshotFromDoc` (com fallback para docs antigos). Exclusão = Soft Delete
> (`isDeleted: true`), filtrado na lista e no painel financeiro. Status alterna no
> Firestore (`pendente`<->`pago`) com atualização local imediata + revert em erro.
> GPS Waze desabilitado sem endereço cadastrado. PWA: vite-plugin-pwa 1.3.0, registerType
> autoUpdate, ícones gerados (pwa-192/512, apple-touch, favicon.ico, masked-icon),
> runtime caching NetworkOnly ignora firestore/identitytoolkit/securetoken.googleapis
> (auth e realtime não passam pelo SW).

## FASE 7: Radar de Oportunidades e Painel Admin
**STATUS: CONCLUÍDA**
1. Criar o `RadarView.jsx` (histórico de vagas disponíveis) e a aba Radar no BottomNav.
2. Criar o `AdminDashboard.jsx` (CRM, Postar Vaga, Vagas Ativas) com rota `/#/admin` protegida.
3. Configurar `.env`/`.env.example` com `VITE_ADMIN_WHATSAPP` e `VITE_ADMIN_EMAIL`.
4. Atualizar `firestore.rules` (regras estritas de admin + leitura de vagas disponíveis).
5. **Teste da Fase 7:** Publicar uma vaga no painel, aparecer no Radar do montador e o botão
   de interesse abrir o WhatsApp do admin com o texto pré-preenchido.

> Notas: Radar usa onSnapshot(`status == 'disponivel'` + orderBy createdAt desc) — requer
> ÍNDICE COMPOSTO; o erro é capturado e o link de criação exibido com console.warn. Badge
> "RECURSO BETA" (amarelo/preto). Botão interessa abre `wa.me/{VITE_ADMIN_WHATSAPP}` com
> mensagem sanitizada via encodeURIComponent. Admin: rota protegida por
> `isAdminEmail(currentUser.email)` (redirect a `/#/app`). `firestore.rules`: /users com
> update/delete só admin (email verificado), leitura do próprio doc e subcoleções mantidas;
> /oportunidades admin read/write e leitura a autenticados apenas quando
> `status == 'disponivel'`. ATENÇÃO: com essas regras, o update do próprio doc `/users/{uid}`
> em Ajustes passa a ser bloqueado (só o admin edita o doc do perfil); preserve o movimento
> adicionando `allow update: if request.auth.uid == userId;` se desejado.