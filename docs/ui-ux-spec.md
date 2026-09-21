# UI/UX Specification & Google Stitch Master Prompt
**Projeto:** Sistema Montador Lucrativo (PWA)
**Público-Alvo:** Montadores de móveis em campo.
**Identidade Visual:** Industrial Dark Suave & DeWalt Yellow (#FFC800).

---

## 1. Design System Tokens (Regras de Estilo DeWalt Inspired)

* **Tema:** Dark Mode Industrial Suave.
* **Cores Principais:**
  * Background Principal: `#121212` (Dark Suave / Preto Grafite Macio)
  * Cards e Superfícies: `#1E1E1E` (Dark Suave Card)
  * Bordas e Divisores: `rgba(255, 200, 0, 0.32)` (Amarelo DeWalt translúcido, 1px) e `#2E3038` (recesso)
  * Cor Primária / Marca (Amarelo DeWalt): `#FFC800`
  * Cor Secundária / Ações de Campo (Ciano Industrial): `#0EA5E9` 
  * Sucesso / Entradas Financeiras: `#10B981` (Verde Esmeralda)
  * Erro / Saídas / Alertas: `#EF4444` (Vermelho Alerta)
  * Texto Principal: `#F8FAFC` (Branco de Alto Contraste)
  * Texto Secundário: `#94A3B8` (Cinza Muted)
  * Cantos: flat industrial (2-4px), sem pills exceto círculos literais (avatar/bolinhas)
* **Tipografia:** Inter (sans-serif robusta, mínimo de 15px para textos normais, para garantir leitura externa).
* **Navegação Inferior:** Bottom Bar com o FAB (Floating Action Button) centralizado, redirecionando direto para "Novo Orçamento".
* **Header:** Auto-oculta ao rolar para baixo e reaparece ao rolar para cima.

---

## 2. PROMPT MESTRE PARA O GOOGLE STITCH / IA GENERATIVA DE UI

> **COPIE E COLE O TEXTO ABAIXO NA FERRAMENTA DE GERAÇÃO DE TELAS:**

```text
Act as an elite Mobile UI/UX Designer specializing in industrial-grade PWA tools for field technicians. 
Design a high-fidelity Dark Mode Mobile Web App interface for "Sistema Montador Lucrativo" (a business app for professional furniture assemblers), using a sleek DeWalt tool aesthetic.

STRICT DESIGN SYSTEM:
- Theme: Dark Suave (Background: #121212, Card: #1E1E1E, Borders: rgba(255,200,0,0.32)).
- Primary Accent: DeWalt Yellow (#FFC800) for primary buttons, active states, and main totals.
- Secondary Accent: Industrial Cyan (#0EA5E9) for utility buttons.
- Positive/Money: Emerald Green (#10B981). Danger/Negative: Bright Red (#EF4444).
- Ergonomics: Minimum font size 15px. Large touch targets (56px height for inputs/buttons). 
- Flat shapes: 2-4px corner radius (no pills). Bottom bar '+' opens Novo Orçamento directly. 

SCREENS TO GENERATE:

SCREEN 1: BUDGET CREATOR (Orçamento)
Design this screen exactly as a sequential field form.
- Top Header: Title "Orçamento" with a small "Limpar" outline button on the right.
- Section 1 "SERVIÇOS": 
  * Full-width search input "Buscar serviço..." with a magnifying glass icon.
  * Below it, a row with 2 equal-width buttons: "+ Avulso" (outline) and "Buscar Manual" (with search icon, cyan tint).
  * (Placeholder for added service cards).
- Section 2 "PEÇAS":
  * Full-width select dropdown "Selecionar...".
  * Below it, a row with 3 elements: "Qtd" input (small), "R$ Unitário" input (flex), and a square primary-colored "+" button to add.
- Section 3 "DADOS DO CLIENTE":
  * Inputs stacked: Nome, CPF (Opcional).
  * A 2-column grid row: Cidade input | Date picker input.
  * A 2-column grid row: Validade (Dias) input | Deslocamento (R$) input.
  * Full-width Textarea for "Observações...".
- Section 4 "PAGAMENTO":
  * A row of selectable pill-buttons: Pix, Dinheiro, Cartão Crédito.
  * Full-width input "Condições (Ex: 3x cartão)".
- Section 5 "TOTAL E AÇÕES":
  * A highlighted thick box showing "Total Geral" and a large DeWalt Yellow value "R$ 380,00".
  * A 3-column grid of square buttons: [Calendar Icon], [Copy Icon "Texto"], [PDF Icon "PDF" in Emerald Green].
  * Below that, full-width outline DeWalt Yellow button: "Termo de Garantia (90 Dias)".
  * Below that, full-width outline button: "Salvar no Histórico".

SCREEN 2: FINANCE DASHBOARD (Financeiro)
- Section 1: "MONITORAMENTO MEI (2026)". Big text "R$ 45.000,00" / "Limite: R$ 81k". A progress bar. Button below: "Relatório Anual (PDF)".
- Section 2: Month selector bar "< Setembro 2026 >".
- Section 3: "BALANÇO DO MÊS". Grid: Faturado (Emerald text) vs Saídas (Red text). Below them, "SALDO LÍQUIDO" in massive Emerald text.
- Section 4: "META DO MÊS". Progress bar. Subtext "Faltam aprox. 20 dias de trabalho".
- Section 5: "Obrigações & Governo". 2-column button grid: "Pagar DAS" and "Emitir Nota (NFS-e)".
- Section 6: "Saídas / Despesas". Text input for Description, row below with "R$" input and a Red square "-" button.
- Section 7: "Entradas Avulsas". Text input for Description, row below with "R$" input and an Emerald square "+" button.
- Section 8: "Ações Rápidas". Full-width button "Gerar Recibo Avulso".

BOTTOM NAVIGATION BAR (All screens):
Fixed dark bar with 5 icons: Ajustes, Clientes, a giant central DeWalt Yellow '+' FAB (Floating Action Button), Histórico, Finanças.

Ensure pixel-perfect padding, zero micro-text clutter, and effortless thumb navigation.
```

---

## 3. Regras de Negócio Implementadas

### 3.1 Valor da Hora Global & Fórmula
- Badge fixo **"Valor da Hora"** no topo de TODAS as telas do app do usuário (rotas `/app/*`, integrado no `AppLayout`).
- Se os custos ainda não foram configurados, o badge exibe o botão **"Calcular Valor da Hora"**, que redireciona para a tela de Ajustes.
- **Fórmula exata:** `ValorHora = (Pro-labore + Despesas Fixas + Depreciação Total de Ferramentas) / Horas no mês`.
- **Padrão de jornada:** `176h/mês` (8h/dia × 22 dias úteis) quando o campo não for preenchido.

### 3.2 Modo Privacidade (Permanente)
- Toggle de privacidade **persistente** (ícone olho 👁️ no badge), salvo em `localStorage` na chave `ml_modo_privacidade`.
- Com a privacidade ativa, **todos os valores financeiros** exibem `R$ ***`: valor da hora, pro-labore, despesas, preços de serviços, valor extra, peças, deslocamento, descontos, totais do orçamento, finanças, histórico e radar (função `formatCurrency` no `AppDataContext`).
- Os **inputs financeiros** são mascarados/desabilitados durante o modo privacidade.
- **Exportações (PDF / WhatsApp) nunca são mascaradas** — são destinadas ao cliente.

### 3.3 Ferramentas & Depreciação
- Módulo **"Gerenciar ferramentas"** em Ajustes: cada ferramenta possui valor, data de aquisição e vida útil em meses.
- A depreciação é calculada mês a mês; ferramenta com vida útil esgotada (≥ 100%) recebe **indicador vermelho** (borda, badge e barra de progresso).
- A **soma da depreciação mensal de todas as ferramentas é injetada automaticamente** nas despesas do cálculo do Valor da Hora.

### 3.4 Busca de Serviços (Orçamento)
- O seletor de serviços **abre imediatamente a lista completa ordenada ao receber foco** (sem exigir digitação).
- **Ordenação:** mais utilizados primeiro (frequência persistida em `localStorage`, chave `ml_freq_servicos`), depois ordem alfabética.
- A digitação mantém o **filtro ativo** sobre a lista ordenada.
- Serviço **avulso** sempre permitido: aparece como sugestão quando o termo digitado não está no catálogo, além do botão dedicado `+ Avulso`.

### 3.5 Validade da Proposta
- A validade do orçamento é definida automaticamente em **7 dias** no formulário.