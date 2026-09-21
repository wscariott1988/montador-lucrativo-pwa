# Sistema Montador Lucrativo

PWA (React + Vite + Firebase) para gestão de campo e precificação inteligente de montadores de móveis. Inclui orçamentos, clientes, financeiro, radar de vagas e painel admin.

## Stack

- **React 19** + `react-router-dom` (hash routing)
- **Vite** + `vite-plugin-pwa` (instalável, offline-first)
- **Firebase** (Auth, Firestore com cache offline)
- **Tailwind CSS** (tema industrial escuro)

## Variáveis de ambiente (`.env.local`)

Copie o `.env.example` para `.env.local` e preencha:

| Variável | Descrição |
| --- | --- |
| `VITE_FIREBASE_*` | Credenciais do projeto Firebase |
| `VITE_ADMIN_EMAIL` | E-mail do admin (bate com `firestore.rules`) |
| `VITE_ADMIN_WHATSAPP` | Número do admin p/ `wa.me` (só dígitos, com DDI+DDD) — ex.: `5551980168744` |
| `VITE_IMGBB_API_KEY` | Chave gratuita da ImgBB para upload de fotos no form "Postar Vaga" |

## Comandos

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run preview  # pré-visualiza o build
```

## Upload de imagens (100% gratuito — ImgBB)

O formulário "Postar Vaga" do Painel Admin (`/#/admin`) permite anexar uma foto do móvel/serviço. O upload é feito **sem cartão de crédito** para a API pública da [ImgBB](https://api.imgbb.com/):

1. Crie a chave gratuita em https://api.imgbb.com/.
2. Cole a chave em `VITE_IMGBB_API_KEY` no `.env.local`.
3. No Admin, selecione a imagem no campo "Foto do móvel / serviço". A imagem é **comprimida/redimensionada no navegador** (max 1280px, JPEG) antes do envio.
4. A URL pública gerada é gravada no campo `imageUrl` do documento da oportunidade.
5. No Radar (`/#/app/radar`), a foto aparece no card da vaga acima da descrição.

Se a chave não estiver configurada, a vaga é publicada normalmente sem foto (apenas um aviso é exibido).

## Assinatura mensal (R$ 19,90)

Os documentos da coleção `users` possuem:

- `dataVencimento` (Timestamp) — data final da assinatura.
- `statusAssinatura` — `'trial'` (novo), `'ativa'` (paga) ou `'expirada'`.

### No app do montador

- **Faltando 5 dias ou menos**: banner fixo no topo avisando sobre a renovação, com botão "Renovar por R$ 19,90 via WhatsApp".
- **Data atual > `dataVencimento`**: as rotas do app são bloqueadas e uma tela de bloqueio exibe o botão "Acertar mensalidade via WhatsApp" (`5551980168744`).

### No Painel Admin (aba CRM)

Para cada montador é exibida a `dataVencimento`, além de:
- Seletor de data (`<input type="date">`) + botão "Salvar data".
- Botão **"+30 Dias (recebi o R$ 19,90)"** que adiciona 30 dias ao vencimento e marca a assinatura como `ativa`.

## Como Migrar para o Firebase Storage no Futuro

Hoje o upload de imagens é feito na API gratuita da **ImgBB**. A migração para o **Firebase Storage** é simples, porque a troca envolve **apenas a função de upload usada no Admin**:

1. Instale o SDK do Firebase Storage (`@firebase/storage` já vem no pacote `firebase`).
2. Crie um serviço, exemplo `src/services/storageService.js`, com uma função equivalente:

   ```js
   import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
   import { storage } from './firebase';

   export async function uploadImageToFirebaseStorage(file, uid) {
     const refAtual = ref(storage, `oportunidades/${uid}-${Date.now()}.jpg`);
     await uploadBytes(refAtual, file);
     return getDownloadURL(refAtual);
   }
   ```

3. No formulário "Postar Vaga" (`src/views/AdminDashboard.jsx`), troque o import de `uploadImageToImgBB` pelo novo `uploadImageToFirebaseStorage`. A URL retornada continuará sendo salva no mesmo campo **`imageUrl`** da oportunidade — o Radar e o restante da lógica não precisam de nenhuma alteração.
4. Ajuste as regras do Firebase Storage (acesso de leitura público para as fotos e escrita autorizada apenas para o admin).
5. Remova a variável `VITE_IMGBB_API_KEY` do `.env.local` e apague `src/services/imgbbService.js`, se desejar.

Nenhum outro componente depende da ImgBB diretamente: tudo passa pelo campo `imageUrl` no Firestore.

## Estrutura relevante

```
src/
├── services/
│   ├── imgbbService.js            # Upload gratuito via ImgBB (compressão client-side)
│   ├── opportunitiesService.js    # Radar + vagas + admin
│   └── userService.js             # Perfil, trial e atualização de assinatura (admin)
├── utils/
│   └── subscription.js            # Cálculo de dias restantes/expiração + link de renovação
├── components/layout/
│   ├── SubscriptionBanner.jsx     # Banner fixo (≤5 dias para vencer)
│   └── SubscriptionLockScreen.jsx # Tela de bloqueio (assinatura expirada)
└── views/
    ├── AdminDashboard.jsx         # CRM (assinatura) + Postar Vaga (foto) + Vagas
    └── RadarView.jsx              # Cards com foto (imageUrl) e botão WhatsApp
```