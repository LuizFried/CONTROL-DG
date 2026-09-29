# 🛡️ DG Tracker — Dashboard Simplificado (0/35 DGs)

Dashboard minimalista, rápido e direto ao ponto para acompanhar o limite de **35 DGs por personagem** e a quantidade feita por cada piloto, integrado ao **Airtable**.

---

## 👥 Personagens & Pilotos Configurados

- **Personagens (Meta: 0/35 DGs cada)**:
  - `Soulreaper`
  - `Crash`
  - `Romero`
  - `Piratex`

- **Pilotos autorizados**:
  - `Hell`
  - `Velax`
  - `Beats`
  - `Tuzão` (também aceita `Tuzao`)

---

## 📋 Como montar sua tabela no Airtable

Acesse [airtable.com](https://airtable.com), crie uma base gratuita e adicione uma tabela chamada **`DGs`** com apenas 3 colunas:

| Coluna | Tipo no Airtable | Valores válidos |
| :--- | :--- | :--- |
| **`Personagem`** | Single line text | `Soulreaper`, `Crash`, `Romero` ou `Piratex` |
| **`Quem Fez`** | Single line text | `Hell`, `Velax`, `Beats` ou `Tuzão` |
| **`Quantidade`** | Number (Inteiro) | Quantas DGs foram feitas (ex: `1`, `5`) |

---

## 🔑 Como Conectar ao Airtable

1. Gere seu token em [airtable.com/create/tokens](https://airtable.com/create/tokens) com a permissão `data.records:read` e selecione sua base.
2. Copie o **Base ID** na URL da sua base (`https://airtable.com/appXXXXXXXXXXXXXX/...`).
3. Adicione no arquivo `.env.local` (local) ou na Vercel:
   ```env
   AIRTABLE_API_KEY=patSeuTokenAqui...
   AIRTABLE_BASE_ID=appSeuBaseIdAqui...
   AIRTABLE_TABLE_NAME=DGs
   ```

---

## 🚀 Como Rodar Localmente

```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no navegador.
