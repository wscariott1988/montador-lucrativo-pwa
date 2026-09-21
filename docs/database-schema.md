# Database Schema (Firestore)

## Coleção: `users` (Montadores)
Contém as informações de perfil e autenticação dos usuários (montadores).
- `uid` (string) - ID único (Auth).
- `email` (string) - Email do usuário.
- `displayName` (string) - Nome completo (mutável pelo usuário).
- `photoURL` (string) - Avatar (mutável pelo usuário).
- `role` (string) - Nível de permissão ex: "user" | "admin" (IMUTÁVEL pelo usuário).
- `createdAt` (timestamp) - Data de criação.
- `updatedAt` (timestamp) - Atualizado a cada edição.

### Subcoleções do usuário (pertencentes ao dono)
- `clientes` - Cadastro de clientes do montador.
- `orcamentos` - Orçamentos gerados pelo montador.
- `ferramentas` - Inventário de ferramentas com depreciação.
- `despesas` - Despesas operacionais.
- `receitas_avulsas` - Receitas avulsas (soma com o faturamento de orçamentos).

### Regras de acesso dos usuários
- O dono do documento pode `read`, `create` e `update` o próprio perfil.
- `delete` do perfil é restrito ao Admin.
- As subcoleções estão liberadas para o dono (`isOwner`) e Admin com `match /{subcollection}/{document=**}`.

## Coleção: `oportunidades` (Radar)
Oportunidades ou vagas ativas no sistema - RECURSO BETA. Totalmente gerenciado por Admins.
- `titulo` (string) - Título da vaga/oportunidade.
- `descricao` (string) - Descrição completa.
- `cidadeUf` (string) - Cidade e UF (ex: "São Paulo - SP").
- `valorEstimado` (number) - Valor estimado do serviço.
- `status` (string) - Ex: "disponivel", "atribuido", "cancelado".
- `createdAt` (timestamp) - Data de criação.
- `updatedAt` (timestamp) - Atualizado a cada edição.

### Regras de acesso das oportunidades
- Leitura: qualquer usuário autenticado.
- Escrita/edição: exclusiva para Admin.