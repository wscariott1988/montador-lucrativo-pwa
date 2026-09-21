```markdown
# PRD: Sistema Montador Lucrativo (PWA)
**Versão:** 1.1 (Revisada com UI Base)
**Plataforma:** PWA (Progressive Web App - Mobile-First)
**Backend:** Firebase (Auth, Firestore, Storage)

## 1. Visão Geral e Perfis de Usuário
O "Sistema Montador Lucrativo" é uma ferramenta de gestão de campo e precificação inteligente para montadores de móveis. O sistema funciona primariamente offline e garante que o montador saiba sua margem de lucro e emita orçamentos no local.

*   **Perfil Montador:** Usuário final. Acessa pelo celular (PWA), focado em botões grandes (Ergonomia de Campo) e funcionamento sem internet.
*   **Perfil Admin (Master):** Dono do SaaS. Acessa via Web para métricas e distribuição de vagas.

---

## 2. Escopo do Aplicativo (Visão Montador)

### Módulo 1: Vendas e Orçamentos (Mobile-First)
A tela de orçamentos é o coração operacional, estruturada no formato formulário contínuo:
*   **Bloco Serviços:** 
    *   Barra de busca com autocomplete buscando de um catálogo dinâmico.
    *   Botão **"+ Avulso"**: Adiciona um item em branco para preenchimento manual.
    *   Botão **"Buscar Manual"**: Abre uma janela/integração para buscar manuais em PDF do móvel na internet.
*   **Bloco Peças:** 
    *   Dropdown de seleção (parafusos, buchas, etc), input de Quantidade, input de Valor e botão "+" para adicionar à lista do orçamento.
*   **Bloco Dados do Cliente & Taxas:** 
    *   Nome, CPF (Opcional), Cidade, Data.
    *   Validade do orçamento (dias) e Taxa de Deslocamento (R$).
    *   Campo de texto livre para Observações.
*   **Bloco Pagamento:** 
    *   Seleção rápida (Pills) das formas aceitas (Pix, Dinheiro, Cartão) e campo de Condições (Ex: "3x no cartão").
*   **Geradores Output (Ações):**
    *   Botão Google Agenda (Gera evento pré-preenchido).
    *   Botão WhatsApp (Copia texto formatado).
    *   Botão PDF Mobile-First (Gera PDF verticalizado para leitura em tela de celular).
    *   Botão Termo de Garantia (Gera PDF de garantia de 90 dias).
    *   Botão "Salvar no Histórico".

### Módulo 2: Inteligência de Preço e Finanças
*   **Balanço do Mês:** Faturado (Verde) vs Saídas (Vermelho) = Saldo Líquido.
*   **Monitoramento MEI:** Barra de progresso anual (Teto R$ 81k). Botão para gerar relatório anual em PDF para declaração.
*   **Meta de Ponto de Equilíbrio:** Calculadora interna define "Dias restantes de trabalho" para pagar os custos fixos + pró-labore da empresa.
*   **Lançamentos Manuais:** Entradas Avulsas (+) e Saídas/Despesas (-).
*   **Links Úteis:** Atalhos para Pagar DAS e Emitir Nota Fiscal (NFS-e).
*   **Gerador de Recibo:** Ferramenta rápida para gerar um recibo PDF avulso.

### Módulo 3: Execução e Histórico
*   **Histórico:** Lista de orçamentos salvos. Ações rápidas no card: Marcar como Pago/Pendente, Re-gerar Recibo, Ver Detalhes, Apagar.
*   **Câmera Segura (Local):** Função de registro do "Antes/Depois". As fotos são salvas *apenas na galeria do celular do usuário*, não consumindo Storage do Firebase (Custo Zero).

### Módulo 4: Radar de Oportunidades (BETA)
*   Feed de vagas/serviços terceirizados postados pelo Admin.
*   Botão "Tenho Interesse" (Abre chat de WhatsApp direto com o Admin).

---

## 3. Matriz Offline-First e Regras de Negócio
O app utilizará a persistência offline nativa do Firebase (`IndexedDB`).

1. **Prioridade de Cache:** As abas de Orçamento e Clientes rodam localmente. O sistema empilha as requisições (fila) se não houver internet e dispara o "Sync" silencioso quando o 4G reconectar.
2. **Cálculos de Totais (Anti-Loop):** O Dashboard Financeiro **não deve** ler todos os milhares de orçamentos do histórico para somar o total do mês. O sistema deve fazer agregações lendo apenas os documentos do mês atual via queries do Firestore, com `limit()` em listagens visuais.
3. **Privacidade de Valores:** Um botão "Olho" no cabeçalho oculta saldos e valores da tela (útil se o montador estiver mostrando o app perto do cliente).

## 4. Monetização e Regras de Acesso
* **Modelo Free Trial (Por Tempo):** O usuário recém-cadastrado ganha 14 (ou 30) dias de acesso total a 100% dos recursos (Calculadora, Financeiro, PDFs, WhatsApp).
* **Bloqueio Hard (Paywall):** Faltando 3 dias, o app exibe um banner de aviso. Ao zerar o tempo, o app bloqueia as ações principais (inserir despesas, criar orçamento) e exibe a tela de Assinatura.
* **Acesso Vitalício (Grandfathering):** Usuários da versão antiga receberão a tag `plano: "lifetime"`, ignorando o bloqueio de tempo.
* **Trava Antifraude (Telefone Único):** No primeiro acesso (onboarding), o usuário deve cadastrar seu WhatsApp. O sistema confere se o número já existe no Firestore. Se existir, bloqueia a criação, impedindo que criem vários e-mails infinitamente para burlar os dias de teste.