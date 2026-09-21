# UI/UX Specification & Google Stitch Master Prompt
**Projeto:** Sistema Montador Lucrativo (PWA)
**Público-Alvo:** Montadores de móveis em campo.
**Identidade Visual:** Industrial Dark & DeWalt Yellow (#FFC200).

---

## 1. Design System Tokens (Regras de Estilo DeWalt Inspired)

* **Tema:** Dark Mode Industrial.
* **Cores Principais:**
  * Background Principal: `#121214` (Dark Zinc / Preto Grafite)
  * Cards e Superfícies: `#1C1D22` (Charcoal Slate)
  * Bordas e Divisores: `#2E3038` (Muted Zinc Border)
  * Cor Primária / Marca (Amarelo DeWalt): `#FFC200`
  * Cor Secundária / Ações de Campo (Ciano Industrial): `#0EA5E9` 
  * Sucesso / Entradas Financeiras: `#10B981` (Verde Esmeralda)
  * Erro / Saídas / Alertas: `#EF4444` (Vermelho Alerta)
  * Texto Principal: `#F8FAFC` (Branco de Alto Contraste)
  * Texto Secundário: `#94A3B8` (Cinza Muted)
* **Tipografia:** Sans-serif robusta (minimo de 15px para textos normais, para garantir leitura externa).
* **Navegação Inferior:** Bottom Bar com o FAB (Floating Action Button) centralizado.

---

## 2. PROMPT MESTRE PARA O GOOGLE STITCH / IA GENERATIVA DE UI

> **COPIE E COLE O TEXTO ABAIXO NA FERRAMENTA DE GERAÇÃO DE TELAS:**

```text
Act as an elite Mobile UI/UX Designer specializing in industrial-grade PWA tools for field technicians. 
Design a high-fidelity Dark Mode Mobile Web App interface for "Sistema Montador Lucrativo" (a business app for professional furniture assemblers), using a sleek DeWalt tool aesthetic.

STRICT DESIGN SYSTEM:
- Theme: Ultra-High Contrast Dark Mode (Background: #121214, Card: #1C1D22, Borders: #2E3038).
- Primary Accent: DeWalt Yellow (#FFC200) for primary buttons, active states, and main totals.
- Secondary Accent: Industrial Cyan (#0EA5E9) for utility buttons.
- Positive/Money: Emerald Green (#10B981). Danger/Negative: Bright Red (#EF4444).
- Ergonomics: Minimum font size 15px. Large touch targets (56px height for inputs/buttons). 

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