---
name: Industrial Assembler Dark
colors:
  surface: '#121212'
  surface-dim: '#121212'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#171717'
  surface-container: '#1E1E1E'
  surface-container-high: '#262626'
  surface-container-highest: '#2f2f2f'
  on-surface: '#e5e1e4'
  on-surface-variant: '#d3c5ab'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#303032'
  outline: '#9c8f78'
  outline-variant: '#4f4632'
  surface-tint: '#ffc800'
  primary: '#ffe5b0'
  on-primary: '#3f2e00'
  primary-container: '#ffc800'
  on-primary-container: '#6d5100'
  inverse-primary: '#785a00'
  secondary: '#89ceff'
  on-secondary: '#00344d'
  secondary-container: '#00a2e6'
  on-secondary-container: '#00344e'
  tertiary: '#7effc4'
  on-tertiary: '#003824'
  tertiary-container: '#54e3a7'
  on-tertiary-container: '#006242'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf9c'
  primary-fixed-dim: '#f9bd00'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#5b4300'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#121212'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-lg:
    fontFamily: Chivo
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
  headline-md:
    fontFamily: Chivo
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  headline-sm:
    fontFamily: Chivo
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
  body-lg:
    fontFamily: Chivo
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Chivo
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: Chivo
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
  label-md:
    fontFamily: Space Mono
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 18px
  label-sm:
    fontFamily: Space Mono
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system targets professional furniture assemblers operating in active job sites, dusty environments, and direct sunlight or dim indoor spaces. The aesthetic balances the rugged, utilitarian feel of professional power tools (inspired by heavy-duty brands like DeWalt) with crisp, modern mobile ergonomics. 

The core philosophy revolves around:
- **Utilitarian Directness:** Immediate feedback, large thumb-friendly control targets, zero decorative fluff.
- **High-Contrast Durability:** Deep asphalt tones anchored by caution-yellow highlights for effortless readability while handling tools or working one-handed.
- **Physical Tool Metaphor:** Surfaces, borders, and tactile actions emulate ruggedized equipment—reinforced edges, metallic and high-vis hazard badges, and mechanical state transformations.

## Colors

The color system is built entirely on dark-mode operational ergonomics:

- **Primary Accent (`#FFC800` - Caution Industrial Yellow):** Reserved strictly for high-priority interactive calls-to-action, active statuses, primary job stages, and critical focal points. Inverted dark text (`#121212`) on this background ensures maximum optical punch.
- **Secondary Accent (`#0EA5E9` - Industrial Cyan / Tech Blue):** Used for technical specs, assembly instruction steps, hardware IDs, and informational state badges.
- **Success (`#10B981` - Positive Cash / Complete):** Represents financial profits, completed assemblies, confirmed payments, and flawless checks.
- **Danger (`#EF4444` - Expense / Hazard Red):** Applied to monetary expenses, damaged parts, safety alerts, and irreversible actions.
- **Surfaces & Layers (Dark Suave):**
  - Base canvas: `#121212` (Ultra-dark asphalt / Preto Suave)
  - Surface elevated: `#1E1E1E` (Dark Suave card)
  - Surface active/recessed: `#262626` (Interactive press states & input beds)
- **Strokes & Dividers:** `rgba(255, 200, 0, 0.32)` transparent DeWalt yellow edge (1px) on containers and separators, with `#2E3038` retained for recessed beds.
- **Text Tiers:** Primary `#FFFFFF`, Secondary `#9CA3AF`, and Muted `#6B7280` guarantee WCAG AAA/AA legibility across low and high ambient light conditions.

## Typography

Typography prioritizes fast cognitive parsing in stressful, noisy, or physically demanding conditions.

- **Primary Typeface (`Chivo`):** Chosen for its aggressive, mechanical grotesk structure, heavy cuts, and immediate clarity.
- **Monospace Accent (`Space Mono`):** Applied to monetary figures, metric dimensions (mm/cm), inventory codes, timers, and hardware quantities.
- **Floor Rule (No Micro-Text):** The minimum font size across all production views is 15px. Labels, metadata, and captions never drop below 15px to prevent eye strain and mistakes while holding parts or tools.
- **Weight Contrast:** Headlines leverage `800` (Extra Bold) and `700` (Bold) weights to anchor scanning rhythm, while body text stays at `400` with high-contrast foreground values.

## Layout & Spacing

The layout is built for a 390px-wide viewport base, maximizing thumb-reach efficiency:

- **Grid Architecture:** 4-column layout on mobile devices with `1rem` (16px) margins and `1rem` gutters. All actionable interfaces stack vertically within standard single-hand sweep zones (bottom 60% of the viewport).
- **Rhythm & Touch Standards:** Elements conform strictly to a base 8px increment. Primary touch zones for buttons, input fields, and interactive list cards maintain an absolute minimum height of 56px to accommodate gloved or dust-covered hands.
- **Sticky Command Bar:** Crucial job operations (e.g., "Iniciar Montagem", "Finalizar e Cobrar") anchor to the bottom safe-area with persistent visibility.

## Elevation & Depth

This design system avoids delicate blurred drop shadows in favor of industrial hard-edge construction, surface differentiation, and tactile beveling:

- **Tier 0 (Base Canvas):** `#121212`.
- **Tier 1 (Surface / Modules):** `#1E1E1E` surfaced with a solid `1px solid rgba(255, 200, 0, 0.32)` perimeter outline.
- **Tier 2 (Elevated Active Controls & Popovers):** `#262626` accompanied by an industrial offset shadow: `0 4px 0 #0D0E10`, mimicking a physically raised button cap or latch.
- **Tactile Button Press:** On active state, the `0 4px 0` offset shadow collapses to `0 0 0`, translating the element downward by 2px to signal direct mechanical engagement.

## Shapes

The geometric silhouette utilizes Level 1 (Soft) geometry:
- **Base Elements:** `0.25rem` (4px) corner radius across inputs, badges, and segmented toggles.
- **Cards & Outer Containers:** `0.5rem` (8px) corner radius.
- **Philosophy:** Rounded pill designs are strictly avoided; corners remain sharp, blocky, and industrial to reflect precision manufacturing, machinery, and ruggedized tool casings.

## Components

### Buttons
- **Primary Industrial CTA:** 56px height, full-width or dominant width. Background `#FFC800`, text `#121212` (Chivo Bold 16px uppercase). Mechanical bottom bevel: `box-shadow: 0 4px 0 #B28800`. Active state depresses 2px with shadow collapsed.
- **Secondary Tool Button:** 56px height. Background `#1E1E1E`, border `1px solid rgba(255, 200, 0, 0.32)`, text `#FFFFFF`. Hover/Active: Background `#262626`, border `#0EA5E9`.
- **Danger Action:** 56px height. Background `#EF4444`, text `#FFFFFF`, bottom bevel `0 4px 0 #991B1B`.

### Input Fields
- **Container:** 56px height, background `#1E1E1E`, border `1px solid rgba(255, 200, 0, 0.32)`, 4px radius. Text `#FFFFFF`, font size 16px.
- **Focus State:** Border expands to `2px solid #FFC800` with an subtle glow (`rgba(255, 200, 0, 0.15)`).
- **Prefix / Suffix Units:** Monospace `#9CA3AF` labels (e.g., "R$", "mm", "UN") integrated into the right/left boundaries.

### Cards & Work Orders
- Background `#1E1E1E`, border `1px solid rgba(255, 200, 0, 0.32)`, radius 8px, padding `1rem`.
- Left accent indicator bar (4px thick) color-coded by job state: Yellow (In Progress), Green (Paid/Complete), Blue (Scheduled).

### Chips & Badges
- Minimum 32px height, padding `4px 12px`, radius 4px.
- Industrial warning stripes or high-contrast solid backgrounds:
  - Caution: Background `rgba(255, 200, 0, 0.12)`, border `1px solid #FFC800`, text `#FFC800`.
  - Financial Positive: Background `rgba(16, 185, 129, 0.12)`, border `1px solid #10B981`, text `#10B981`.
- Font: `Space Mono`, 15px, Bold.

### Checkboxes & Hardware Counters
- **Checkboxes:** 28x28px box, border `2px solid #262626`, radius 4px. Checked state: Background `#FFC800`, checkmark `#121212` (2.5px stroke weight).
- **Numeric Stepper (Hardware Counter):** 56px height segmented bar. Decrement/Increment buttons (minimum 48px square touch area) flanking a center monospace readout.

## Applied Business Rules

### Valor da Hora Global & Formato Fixo
- A badge "Valor da Hora" is **fixed at the top of every user screen** (all `/app/*` routes) via the shared `AppLayout` shell.
- If costs are not configured yet, the badge renders a `Calcular Valor da Hora` CTA that routes the user to the Ajustes screen.
- **Formula:** `(Pró-labore + Despesas Fixas + Depreciação Total de Ferramentas) / Horas trabalhadas no mês`.
- **Default workload:** `176h` per month (8h/day × 22 days) when the user leaves the field blank.

### Privacy Mode (Modo Privacidade)
- A permanent privacy toggle (eye 👁️ on the Valor da Hora badge) is available on every screen; the state persists in `localStorage` (key `ml_modo_privacidade`).
- When enabled, **every financial value is masked as `R$ ***`** across all user screens: valor da hora, custos, preços de serviços, valor extra, peças, deslocamento, descontos, totais, finanças, histórico e radar. Financial inputs are masked/disabled.
- Exports (PDF / WhatsApp) are **never masked** — they are intended for the client.

### Ferramentas & Depreciação
- The Ajustes screen hosts a "Gerenciar ferramentas" module where each tool records value, purchase date and useful life (months).
- Depreciation is computed month by month; a tool whose useful life reached ≥ 100% shows a **red indicator** (border, badge and progress bar) so the assembler knows it must be replaced.
- The **sum of all tools' monthly depreciation is injected automatically** into the Valor da Hora calculation.

### Busca de Serviços (Orçamento)
- The service picker **opens its full ordered list immediately on focus** (no typing required).
- Sort order: **most-used first** (frequency persisted in `localStorage`, key `ml_freq_servicos`), then alphabetical.
- Typing keeps the live filter active over the ordered list.
- **Avulso** (ad-hoc service) is always allowed: a suggested row appears when the typed term is not in the catalog, plus a dedicated `+ Avulso` button.