# Simulador Urna 2026 (Clone 1:1)

Clone 1:1 de alta fidelidade e performance do site [urna2026.com](https://urna2026.com/), desenvolvido com **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** e arquitetura **Serverless / Edge-Ready** otimizada para deploy na **Vercel**.

---

## 🚀 Funcionalidades Principais

1. **Simulador de Urna Eletrônica Autêntico:**
   - Teclado numérico com relevo e ponto tátil no número 5.
   - Botões funcionais: `BRANCO`, `CORRIGE` e `CONFIRMA`.
   - Atalhos de teclado físico suportados (`Enter`, `Del`, `B`, números `0-9`).
   - Foto dinâmica do candidato e informações oficiais de chapa na tela LCD.
   - Síntese de áudio autêntica da Urna do TSE usando **Web Audio API** (sem dependência de arquivos externos ou falhas de carregamento em redes móveis).
   - Tela de transição "GRAVANDO" e a icônica tela "FIM" com som clássico e efeito de confetes.

2. **Controle Estrito de Unicidade de Voto:**
   - Multi-camada de verificação para garantir **1 voto por dispositivo**:
     - `LocalStorage`
     - `Cookies (SameSite=Lax)`
     - `Browser Canvas & Device Fingerprint (SHA-256)`
     - Verificação e bloqueio no lado do servidor com conjuntos atômicos (`SADD`).

3. **Arquitetura Serverless de Alta Concorrência (Sem Banco SQL Tradicional):**
   - Suporte nativo ao **Vercel KV / Upstash Redis** para operações atômicas (`INCRBY`, `SADD`, `GET`).
   - Fallback inteligente em memória com persistência durante a execução para desenvolvimento local sem necessidade de credenciais de banco.

4. **Painel de Apuração e Linha do Tempo:**
   - Placar ao vivo com percentuais válidos e cálculo idêntico ao TSE.
   - Gráfico vetorial SVG interativo de linha do tempo com picos por hora e tabela detalhada hora a hora.
   - Polling automático e atualização instantânea no momento do voto.

5. **Apoio via Pix & Informações do Desenvolvedor:**
   - Chave Pix configurável via variável de ambiente (`NEXT_PUBLIC_PIX_KEY`).
   - Botões de copiar chave, Pix copia e cola e modal com QR Code.
   - Rodapé com dados de contato e portfólio de **Gilnathan de Araújo Reis** (Full-Stack Developer).

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React
- **Efeitos:** Canvas Confetti & Web Audio API
- **Infraestrutura:** Vercel Serverless / KV (Upstash Redis)

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto (baseado em `.env.example`):

```bash
# Chave Pix exibida para doações
NEXT_PUBLIC_PIX_KEY=54602172-ac07-44de-9458-1a5c6da5f62d

# (Opcional) Vercel KV / Upstash Redis para concorrência atômica em produção
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

---

## 📦 Como Rodar Localmente

```bash
cd urna2026

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador ou smartphone na mesma rede local.

---

## 🚢 Deploy na Vercel

1. Suba o código para seu repositório no GitHub (`github.com/Gilnathan/...`).
2. Conecte o repositório na [Vercel](https://vercel.com).
3. Na seção de **Environment Variables**, defina:
   - `NEXT_PUBLIC_PIX_KEY`: Sua chave Pix.
4. (Recomendado para tráfego massivo): Na aba **Storage** do seu projeto na Vercel, crie um banco **KV (Upstash Redis)** com 1 clique. As variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN` serão conectadas automaticamente!
5. Clique em **Deploy**.

---

Desenvolvido por **Gilnathan de Araújo Reis**  
- Portfólio: [gilnathanreis.com.br](https://www.gilnathanreis.com.br)  
- GitHub: [github.com/Gilnathan](https://github.com/Gilnathan)  
- Instagram: [@gilnathan_dev](https://instagram.com/gilnathan_dev)  
- E-mail: gilthanreis@gmail.com
