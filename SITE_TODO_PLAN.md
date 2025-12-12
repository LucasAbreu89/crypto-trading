# 🚀 PLANO COMPLETO - SITE DE SINAIS CRYPTO

## 📋 VISÃO GERAL DO PROJETO

**Objetivo:** Criar um site cyber futurista para vender sinais de trading de criptomoedas, mostrando credibilidade através de backtest transparente e resultados comprovados.

**Estilo Visual:** Cyber futurista, dark mode, neon accents (cyan/purple/green), animações suaves, gráficos interativos.

**Tech Stack Sugerida:**
- Frontend: Next.js 14 + TypeScript + Tailwind CSS
- Gráficos: Recharts ou TradingView Lightweight Charts
- Animações: Framer Motion
- Auth: NextAuth.js ou Clerk
- Pagamentos: Stripe
- Banco de dados: PostgreSQL + Prisma
- Deploy: Vercel

---

## 📁 ESTRUTURA DE PÁGINAS

```
/                       → Landing Page (pública)
/about                  → Sobre nós / Metodologia
/backtest               → Transparência do Backtest
/performance            → Performance por moeda
/live-signals           → Sinais ao vivo (preview limitado)
/pricing                → Planos e preços
/login                  → Login
/register               → Cadastro
/dashboard              → Área do usuário (privada)
/dashboard/signals      → Sinais ativos
/dashboard/history      → Histórico de sinais
/dashboard/settings     → Configurações da conta
/dashboard/subscription → Gerenciar assinatura
```

---

## 📝 TO-DO LIST DETALHADO

---

### 🏠 1. LANDING PAGE (HOME)

A página mais importante - primeira impressão do usuário.

#### 1.1 Hero Section
- [ ] Background com efeito de grid/matrix animado (estilo cyber)
- [ ] Headline impactante: "Sinais de Trading Baseados em Dados, Não em Achismo"
- [ ] Sub-headline: "11 indicadores técnicos. 2 anos de backtest. Resultados comprovados."
- [ ] Estatísticas em destaque (animadas ao carregar):
  - [ ] Win Rate médio (ex: "72% Win Rate")
  - [ ] Total de trades executados (ex: "+2,500 trades analisados")
  - [ ] Retorno acumulado (ex: "+847% desde 2024")
  - [ ] Tempo de backtest (ex: "2 anos de dados históricos")
- [ ] CTA principal: "Começar Agora" → /pricing
- [ ] CTA secundário: "Ver Resultados" → /performance
- [ ] Badge de "Sinais ao Vivo" pulsando (mostra que está ativo)

#### 1.2 Social Proof Bar
- [ ] Logos de exchanges suportadas (Binance, Bybit, Hyperliquid)
- [ ] Número de usuários ativos (pode começar com "Junte-se a +100 traders")
- [ ] Rating/reviews quando tiver

#### 1.3 "Por que Somos Diferentes" Section
- [ ] Card 1: "📊 Baseado em Dados"
  - Descrição: "11 indicadores técnicos analisados simultaneamente"
  - Ícone animado de gráfico
- [ ] Card 2: "🔬 Backtest Transparente"
  - Descrição: "2 anos de dados históricos públicos para verificação"
  - Ícone de microscópio/lupa
- [ ] Card 3: "⚡ Sinais em Tempo Real"
  - Descrição: "Alertas instantâneos via Telegram e Email"
  - Ícone de raio/notificação
- [ ] Card 4: "🎯 Sem Achismo"
  - Descrição: "Cada sinal tem critérios objetivos e mensuráveis"
  - Ícone de alvo
- [ ] Card 5: "📈 Acompanhamento Completo"
  - Descrição: "Entry, Take Profit e tempo de holding definidos"
  - Ícone de checklist
- [ ] Card 6: "🔒 Risco Controlado"
  - Descrição: "Parâmetros ajustados por volatilidade de cada ativo"
  - Ícone de escudo

#### 1.4 Preview de Performance (Mini Gráfico)
- [ ] Gráfico de equity curve simplificado (últimos 6 meses)
- [ ] Moedas disponíveis com mini-stats:
  - SOL: Win Rate XX%, Avg Return XX%
  - BTC: Win Rate XX%, Avg Return XX%
  - ETH: Win Rate XX%, Avg Return XX%
- [ ] Botão "Ver Performance Completa" → /performance

#### 1.5 Como Funciona (3 Steps)
- [ ] Step 1: "Assine um Plano" - Ícone de cartão/moeda
- [ ] Step 2: "Receba Sinais" - Ícone de Telegram/Email
- [ ] Step 3: "Execute e Lucre" - Ícone de gráfico subindo
- [ ] Linha conectando os 3 steps com animação

#### 1.6 Seção de Sinais ao Vivo (Preview)
- [ ] Mostrar 1-2 sinais recentes (blur no preço para não-assinantes)
- [ ] Formato do card de sinal:
  ```
  🟢 LONG SOL/USDT
  Entry: $XXX.XX (blurred)
  TP: +4%
  Status: EM ANDAMENTO
  Tempo: 12h/48h
  Força: STRONG (9/11 checks)
  ```
- [ ] Botão "Ver Todos os Sinais" → /pricing

#### 1.7 Testimonials/Results Section
- [ ] Cards de resultados reais (screenshots de trades)
- [ ] Ou: Cards com métricas de meses específicos
  - "Novembro 2024: +18.3% | 45 trades | 68.9% win rate"
- [ ] Carrossel automático

#### 1.8 FAQ Section
- [ ] "Como os sinais são gerados?"
- [ ] "Qual a taxa de acerto?"
- [ ] "Como recebo os sinais?"
- [ ] "Posso cancelar a qualquer momento?"
- [ ] "Funciona para iniciantes?"
- [ ] "Qual exchange devo usar?"
- [ ] Accordion style (clica para expandir)

#### 1.9 CTA Final
- [ ] Background gradiente cyber (purple → cyan)
- [ ] "Pronto para operar com dados, não com sorte?"
- [ ] Botão grande "Começar Agora"
- [ ] Garantia: "7 dias de garantia ou seu dinheiro de volta"

#### 1.10 Footer
- [ ] Links para todas as páginas
- [ ] Disclaimer legal sobre trading
- [ ] Redes sociais (Telegram, Twitter/X)
- [ ] Copyright

---

### 📊 2. PÁGINA DE PERFORMANCE (/performance)

Página crucial para mostrar credibilidade.

#### 2.1 Header da Página
- [ ] Título: "Performance Comprovada"
- [ ] Subtítulo: "Resultados reais baseados em 2 anos de dados históricos"
- [ ] Seletor de período: 1M, 3M, 6M, 1Y, ALL
- [ ] Seletor de moeda: ALL, SOL, BTC, ETH, etc.

#### 2.2 KPIs Principais (Cards no Topo)
- [ ] Total Return (%)
- [ ] Win Rate (%)
- [ ] Total Trades
- [ ] Profit Factor
- [ ] Max Drawdown (%)
- [ ] Sharpe Ratio
- [ ] Cada card com ícone e cor indicativa (verde/vermelho)

#### 2.3 Gráfico de Equity Curve (Principal)
- [ ] Gráfico de linha grande e interativo
- [ ] Tooltip ao passar o mouse (data, valor, % change)
- [ ] Linha de benchmark opcional (buy & hold)
- [ ] Zoom/pan habilitado
- [ ] Botão para download do gráfico

#### 2.4 Tabela de Performance Mensal
- [ ] Colunas: Mês, Trades, Win Rate, PNL (%), PNL ($)
- [ ] Cores: verde para positivo, vermelho para negativo
- [ ] Ordenável por qualquer coluna
- [ ] Paginação ou scroll infinito

#### 2.5 Performance por Moeda (Tabs ou Cards)
- [ ] Tab/Card para cada moeda: SOL, BTC, ETH, AVAX, LTC, SUI
- [ ] Para cada moeda mostrar:
  - [ ] Mini equity curve
  - [ ] Win Rate
  - [ ] Avg Return per Trade
  - [ ] Total Trades
  - [ ] Best Trade / Worst Trade
  - [ ] Profit Factor

#### 2.6 Distribuição de Retornos (Histograma)
- [ ] Gráfico de barras mostrando distribuição dos retornos
- [ ] Eixo X: % de retorno (buckets: -5%, -3%, -1%, +1%, +3%, +5%, +7%...)
- [ ] Eixo Y: Quantidade de trades
- [ ] Mostra que distribuição é positivamente enviesada

#### 2.7 Drawdown Analysis
- [ ] Gráfico de drawdown ao longo do tempo
- [ ] Tabela com maiores drawdowns:
  - Data início, Data fim, Duração, % queda, Recuperação

#### 2.8 Estatísticas Avançadas
- [ ] Avg Time in Trade
- [ ] Avg Time to High (quão rápido atinge o pico)
- [ ] % de trades que atingem TP
- [ ] Melhor mês / Pior mês
- [ ] Sequência máxima de wins / losses

#### 2.9 Download de Dados
- [ ] Botão para download do trading log em CSV
- [ ] Ou: Preview das primeiras 20 linhas + "Assine para ver completo"

---

### 🔬 3. PÁGINA DE BACKTEST (/backtest)

Transparência total - diferencial competitivo.

#### 3.1 Header
- [ ] Título: "Metodologia 100% Transparente"
- [ ] Subtítulo: "Entenda exatamente como nossos sinais são gerados"

#### 3.2 Visão Geral do Sistema
- [ ] Diagrama visual do fluxo:
  ```
  Dados de Mercado → 11 Checks → Classificação → Sinal
  ```
- [ ] Animação mostrando o fluxo

#### 3.3 Os 11 Indicadores (Accordion ou Cards)
Para cada indicador, mostrar:
- [ ] Nome e ícone
- [ ] O que verifica (explicação simples)
- [ ] Por que importa
- [ ] Exemplo visual (mini gráfico ou ilustração)

**Lista dos 11:**
1. [ ] Price Action 4H - Trendlines/Resistência
2. [ ] Price Action 1H - Candle Forte de Alta
3. [ ] Price Action 1H - Fechou Acima da Resistência
4. [ ] Volume 1H - Spike de Volume
5. [ ] Breakout + Volume
6. [ ] RSI 1H/4H - Acima de 50 e Subindo
7. [ ] MACD - Crossover Bullish
8. [ ] ADX - Força de Tendência
9. [ ] ATR - Volatilidade Razoável
10. [ ] Open Interest - Aumento Significativo
11. [ ] Funding Rate - Não Muito Alto

#### 3.4 Classificação dos Sinais
- [ ] Explicação visual:
  - 🟢 STRONG: 8+ checks aprovados
  - 🟡 MODERATE: 6-7 checks aprovados
  - 🔴 WEAK: <6 checks (não operamos)
- [ ] "Só enviamos sinais STRONG para nossos assinantes"

#### 3.5 Otimização de Cenários
- [ ] Explicação simplificada do processo de otimização
- [ ] "Testamos 2.047 combinações diferentes"
- [ ] "Selecionamos apenas as combinações com melhor performance histórica"
- [ ] Gráfico comparativo: combinações top vs combinações médias

#### 3.6 Configurações por Moeda
- [ ] Tabela mostrando que cada moeda tem parâmetros ajustados:
  | Moeda | Vol. Mult | ATR Thresh | Hold Time |
  |-------|-----------|------------|-----------|
  | SOL   | 1.6x      | 2.5%       | 48h       |
  | BTC   | 1.3x      | 2.0%       | 72h       |
  | ...   | ...       | ...        | ...       |

#### 3.7 Fontes de Dados
- [ ] Lista de fontes: Binance, Bybit (FR/OI), Hyperliquid
- [ ] "Dados atualizados a cada hora"
- [ ] Período de backtest: Janeiro 2024 - Presente

#### 3.8 Limitações e Disclaimers
- [ ] Honestidade sobre limitações:
  - "Backtest não garante resultados futuros"
  - "Slippage real pode variar"
  - "Mercado pode mudar"
- [ ] Mostra credibilidade por ser transparente

#### 3.9 CTA
- [ ] "Convencido? Veja nossos planos"
- [ ] Botão → /pricing

---

### 💰 4. PÁGINA DE PREÇOS (/pricing)

#### 4.1 Header
- [ ] Título: "Escolha seu Plano"
- [ ] Toggle: Mensal / Anual (desconto no anual)

#### 4.2 Cards de Planos (3 planos sugeridos)

**Plano Starter:**
- [ ] Preço: $XX/mês
- [ ] 1 moeda (SOL ou BTC)
- [ ] Sinais via Email
- [ ] Acesso ao dashboard básico
- [ ] Suporte por email

**Plano Pro (Destacado como "Mais Popular"):**
- [ ] Preço: $XX/mês
- [ ] 3 moedas (SOL, BTC, ETH)
- [ ] Sinais via Telegram + Email
- [ ] Acesso ao dashboard completo
- [ ] Performance detalhada
- [ ] Suporte prioritário

**Plano Premium:**
- [ ] Preço: $XX/mês
- [ ] Todas as moedas (6)
- [ ] Sinais via Telegram + Email
- [ ] Acesso completo
- [ ] API de sinais (para bots)
- [ ] Suporte VIP (WhatsApp/Discord)
- [ ] Consultoria mensal de 30min

#### 4.3 Comparativo de Features
- [ ] Tabela comparando os 3 planos
- [ ] Checkmarks verdes para features incluídas
- [ ] X vermelho para não incluídas

#### 4.4 Garantia
- [ ] Badge grande: "7 Dias de Garantia"
- [ ] "Se não gostar, devolvemos 100% do seu dinheiro"

#### 4.5 FAQ de Pagamento
- [ ] Formas de pagamento aceitas
- [ ] Como cancelar
- [ ] Como funciona a renovação

#### 4.6 CTA Final
- [ ] "Ainda com dúvidas? Fale conosco"
- [ ] Link para Telegram/WhatsApp

---

### 🔐 5. AUTENTICAÇÃO

#### 5.1 Página de Login (/login)
- [ ] Design cyber futurista
- [ ] Campos: Email, Senha
- [ ] "Lembrar de mim"
- [ ] "Esqueci minha senha"
- [ ] Botão de login
- [ ] "Não tem conta? Cadastre-se"
- [ ] Login social opcional (Google)

#### 5.2 Página de Cadastro (/register)
- [ ] Campos: Nome, Email, Senha, Confirmar Senha
- [ ] Checkbox: Aceito termos de uso
- [ ] Checkbox: Aceito receber emails
- [ ] Botão de cadastro
- [ ] "Já tem conta? Faça login"

#### 5.3 Recuperação de Senha
- [ ] Página para solicitar reset
- [ ] Email com link de reset
- [ ] Página para definir nova senha

---

### 👤 6. ÁREA DO USUÁRIO (DASHBOARD)

#### 6.1 Layout do Dashboard
- [ ] Sidebar com navegação:
  - 📊 Overview
  - 🎯 Sinais Ativos
  - 📜 Histórico
  - ⚙️ Configurações
  - 💳 Assinatura
- [ ] Header com:
  - Nome do usuário
  - Tipo do plano (badge)
  - Botão de logout
- [ ] Design consistente com o resto do site

#### 6.2 Dashboard Overview
- [ ] Boas-vindas personalizadas
- [ ] Cards com resumo:
  - Sinais ativos agora
  - Último sinal recebido
  - Performance do mês
  - Próximo pagamento
- [ ] Mini gráfico de performance recente
- [ ] Sinais ativos em destaque

#### 6.3 Página de Sinais Ativos (/dashboard/signals)
- [ ] Lista de sinais atualmente abertos
- [ ] Para cada sinal:
  ```
  🟢 LONG SOL/USDT
  ━━━━━━━━━━━━━━━━━━━━━━━━
  Entry: $145.32
  Take Profit: $151.13 (+4%)
  Hold Time: 48h
  ━━━━━━━━━━━━━━━━━━━━━━━━
  Status: EM ANDAMENTO
  Tempo decorrido: 12h 35min
  PNL atual: +2.3% 📈
  ━━━━━━━━━━━━━━━━━━━━━━━━
  Força: STRONG (9/11)
  Aberto em: 2025-12-11 15:00 UTC
  ```
- [ ] Atualização em tempo real do PNL (ou a cada 5min)
- [ ] Filtro por moeda
- [ ] Filtro por status (aberto/fechado)

#### 6.4 Página de Histórico (/dashboard/history)
- [ ] Tabela com todos os sinais passados
- [ ] Colunas: Data, Moeda, Direção, Entry, Exit, PNL%, Status
- [ ] Filtros: Moeda, Período, Resultado (win/loss)
- [ ] Paginação
- [ ] Export para CSV
- [ ] Estatísticas do período filtrado

#### 6.5 Página de Configurações (/dashboard/settings)
- [ ] Alterar dados pessoais (nome, email)
- [ ] Alterar senha
- [ ] Configurar notificações:
  - [ ] Toggle: Receber por Email
  - [ ] Toggle: Receber por Telegram
  - [ ] Input: ID do Telegram (com instrução de como pegar)
- [ ] Configurar moedas de interesse (se plano permitir)
- [ ] Deletar conta

#### 6.6 Página de Assinatura (/dashboard/subscription)
- [ ] Plano atual (com badge)
- [ ] Data de renovação
- [ ] Histórico de pagamentos
- [ ] Botão "Fazer Upgrade"
- [ ] Botão "Cancelar Assinatura"
- [ ] Alterar forma de pagamento

---

### 📡 7. SISTEMA DE NOTIFICAÇÕES

#### 7.1 Integração com Telegram
- [ ] Bot do Telegram configurado
- [ ] Comando /start para vincular conta
- [ ] Formato da mensagem de sinal:
  ```
  🚀 NOVO SINAL - LONG

  📊 Par: SOL/USDT
  💰 Entry: $145.32
  🎯 Take Profit: +4% ($151.13)
  ⏰ Hold Time: 48h
  💪 Força: STRONG (9/11 checks)

  ⚠️ Lembre-se: Use sempre gestão de risco!

  🔗 Ver detalhes: [link para dashboard]
  ```
- [ ] Mensagem de fechamento:
  ```
  ✅ SINAL FECHADO - LONG SOL

  📊 Resultado: +3.8% 🟢
  ⏱️ Duração: 18h 42min
  📈 Entry: $145.32 → Exit: $150.84

  💰 Performance do mês: +12.4%
  ```

#### 7.2 Integração com Email
- [ ] Templates de email bonitos (HTML)
- [ ] Email de novo sinal
- [ ] Email de sinal fechado
- [ ] Email semanal com resumo de performance
- [ ] Opção de unsubscribe

---

### 🎨 8. DESIGN SYSTEM (Cyber Futurista)

#### 8.1 Cores
```css
--bg-primary: #0a0a0f        /* Preto profundo */
--bg-secondary: #12121a      /* Cinza escuro */
--bg-card: #1a1a2e           /* Card background */
--accent-cyan: #00f5ff       /* Cyan neon */
--accent-purple: #8b5cf6     /* Purple */
--accent-green: #10b981      /* Verde para positivo */
--accent-red: #ef4444        /* Vermelho para negativo */
--text-primary: #ffffff      /* Branco */
--text-secondary: #9ca3af    /* Cinza claro */
--border: #2d2d3d            /* Bordas sutis */
```

#### 8.2 Efeitos Visuais
- [ ] Glassmorphism em cards (backdrop-blur)
- [ ] Glow effects nos elementos de destaque
- [ ] Grid pattern sutil no background
- [ ] Gradientes sutis (purple → cyan)
- [ ] Hover effects com transições suaves
- [ ] Loading states com animações

#### 8.3 Tipografia
- [ ] Font principal: Inter ou Space Grotesk
- [ ] Font para números/dados: JetBrains Mono ou Fira Code
- [ ] Hierarquia clara (h1, h2, h3, body, small)

#### 8.4 Componentes Reutilizáveis
- [ ] Button (primary, secondary, outline)
- [ ] Card (com borda glow opcional)
- [ ] Input (com estilo cyber)
- [ ] Badge (status, plano)
- [ ] Table (com zebra stripes)
- [ ] Chart container (com header e filtros)
- [ ] Signal card
- [ ] Stat card (número grande + label)
- [ ] Alert/Toast
- [ ] Modal
- [ ] Tooltip

#### 8.5 Animações
- [ ] Fade in ao carregar página
- [ ] Slide up em cards
- [ ] Counter animation para números
- [ ] Pulse em badges de "ao vivo"
- [ ] Hover scale sutil em cards
- [ ] Loading spinner cyber

#### 8.6 Responsividade
- [ ] Mobile-first design
- [ ] Breakpoints: sm(640), md(768), lg(1024), xl(1280)
- [ ] Menu hamburguer no mobile
- [ ] Gráficos adaptáveis
- [ ] Tabelas com scroll horizontal no mobile

---

### 🔧 9. BACKEND/API (Estrutura Básica)

#### 9.1 Endpoints Necessários

**Públicos:**
- [ ] GET /api/performance/summary - KPIs para landing
- [ ] GET /api/performance/equity - Dados do gráfico de equity
- [ ] GET /api/performance/monthly - Performance mensal
- [ ] GET /api/signals/preview - 1-2 sinais (sem preço)

**Autenticados:**
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] POST /api/auth/forgot-password
- [ ] GET /api/user/profile
- [ ] PUT /api/user/profile
- [ ] GET /api/user/subscription

**Sinais (autenticados):**
- [ ] GET /api/signals/active - Sinais abertos
- [ ] GET /api/signals/history - Histórico
- [ ] GET /api/signals/:id - Detalhes de um sinal

**Admin:**
- [ ] POST /api/admin/signals - Criar novo sinal
- [ ] PUT /api/admin/signals/:id - Atualizar sinal
- [ ] GET /api/admin/users - Listar usuários

#### 9.2 Modelos de Dados

**User:**
```
id, email, password_hash, name, telegram_id,
plan_type, plan_expires_at, created_at
```

**Signal:**
```
id, symbol, direction, entry_price, tp_price, tp_pct,
hold_time, strength, checks_passed, status,
exit_price, exit_reason, pnl_pct,
opened_at, closed_at
```

**Subscription:**
```
id, user_id, plan_type, status,
stripe_subscription_id, current_period_start,
current_period_end
```

---

### 📱 10. INTEGRAÇÕES

#### 10.1 Stripe (Pagamentos)
- [ ] Checkout para novos assinantes
- [ ] Portal do cliente para gerenciar assinatura
- [ ] Webhooks para eventos (payment_success, subscription_cancelled)
- [ ] Múltiplos planos configurados

#### 10.2 Telegram Bot
- [ ] Criar bot via BotFather
- [ ] Implementar /start para vinculação
- [ ] Função para enviar mensagem para usuário
- [ ] Função para enviar broadcast para todos assinantes

#### 10.3 Email (Resend, SendGrid ou similar)
- [ ] Configurar domínio para envio
- [ ] Templates de email
- [ ] Função para enviar emails transacionais
- [ ] Função para enviar emails em massa

#### 10.4 Analytics
- [ ] Google Analytics ou Plausible
- [ ] Eventos: página visitada, CTA clicado, checkout iniciado
- [ ] Funil de conversão

---

### 🚀 11. DEPLOY E INFRAESTRUTURA

#### 11.1 Domínio
- [ ] Escolher e comprar domínio
- [ ] Configurar DNS
- [ ] SSL (automático com Vercel)

#### 11.2 Vercel
- [ ] Conectar repositório
- [ ] Configurar variáveis de ambiente
- [ ] Deploy automático em push

#### 11.3 Banco de Dados
- [ ] PostgreSQL (Supabase, Railway, ou Neon)
- [ ] Migrations configuradas
- [ ] Backup automático

#### 11.4 Monitoramento
- [ ] Logs de erro (Sentry)
- [ ] Uptime monitoring
- [ ] Alertas se algo quebrar

---

### 📋 12. CONTEÚDO E COPY

#### 12.1 Textos para Landing Page
- [ ] Headlines e sub-headlines
- [ ] Descrições dos diferenciais
- [ ] FAQs completas
- [ ] Descrições dos planos

#### 12.2 Páginas Legais
- [ ] Termos de Uso
- [ ] Política de Privacidade
- [ ] Disclaimer de Trading (importante!)
- [ ] Política de Reembolso

#### 12.3 Emails
- [ ] Boas-vindas
- [ ] Confirmação de pagamento
- [ ] Novo sinal
- [ ] Sinal fechado
- [ ] Lembrete de renovação
- [ ] Tentativa de pagamento falhou

---

### 🧪 13. TESTES E QA

#### 13.1 Testes Funcionais
- [ ] Fluxo de cadastro completo
- [ ] Fluxo de login/logout
- [ ] Fluxo de assinatura (checkout)
- [ ] Recebimento de sinais (Telegram e Email)
- [ ] Dashboard funcionando
- [ ] Gráficos carregando corretamente

#### 13.2 Testes de Responsividade
- [ ] Desktop (1920px, 1440px, 1280px)
- [ ] Tablet (768px)
- [ ] Mobile (375px, 390px)

#### 13.3 Testes de Performance
- [ ] Lighthouse score > 90
- [ ] Tempo de carregamento < 3s
- [ ] Gráficos não travando

---

### 📅 14. ORDEM SUGERIDA DE IMPLEMENTAÇÃO

**Fase 1 - MVP (2-3 semanas):**
1. [ ] Setup do projeto (Next.js + Tailwind)
2. [ ] Design system básico (cores, componentes)
3. [ ] Landing page completa
4. [ ] Página de performance (com dados hardcoded)
5. [ ] Página de backtest/metodologia
6. [ ] Página de preços

**Fase 2 - Autenticação e Pagamentos (1-2 semanas):**
7. [ ] Sistema de autenticação
8. [ ] Integração com Stripe
9. [ ] Dashboard básico do usuário
10. [ ] Página de assinatura

**Fase 3 - Sistema de Sinais (1-2 semanas):**
11. [ ] Backend para sinais
12. [ ] Dashboard com sinais ativos
13. [ ] Histórico de sinais
14. [ ] Integração Telegram
15. [ ] Integração Email

**Fase 4 - Polimento (1 semana):**
16. [ ] Testes completos
17. [ ] SEO e meta tags
18. [ ] Analytics
19. [ ] Páginas legais
20. [ ] Deploy final

---

### 💡 15. IDEIAS EXTRAS (FUTURO)

- [ ] App mobile (React Native)
- [ ] API pública para bots de trading
- [ ] Leaderboard de performance de usuários
- [ ] Programa de afiliados
- [ ] Comunidade Discord/Telegram exclusiva
- [ ] Cursos/educação sobre trading
- [ ] Sinais para SHORT (além de LONG)
- [ ] Mais moedas/pares
- [ ] Backtester público (usuário testa próprias estratégias)

---

## 📊 DADOS HARDCODED PARA COMEÇAR

### Performance Summary (Landing)
```javascript
const performanceSummary = {
  totalReturn: 847.32,      // %
  winRate: 68.3,            // %
  totalTrades: 2547,
  profitFactor: 2.14,
  maxDrawdown: 4.21,        // %
  sharpeRatio: 1.85,
  avgReturnPerTrade: 2.45,  // %
  dataStartDate: "2024-01-01",
  dataEndDate: "2025-12-11"
}
```

### Performance por Moeda
```javascript
const performanceBySymbol = {
  SOL: {
    winRate: 72.4,
    avgReturn: 3.12,
    totalTrades: 423,
    profitFactor: 2.45,
    bestTrade: 12.8,
    worstTrade: -5.2
  },
  BTC: {
    winRate: 71.2,
    avgReturn: 2.45,
    totalTrades: 389,
    profitFactor: 2.28,
    bestTrade: 8.5,
    worstTrade: -3.8
  },
  ETH: {
    winRate: 69.8,
    avgReturn: 2.78,
    totalTrades: 412,
    profitFactor: 2.15,
    bestTrade: 9.2,
    worstTrade: -4.1
  }
  // ... outras moedas
}
```

### Equity Curve (exemplo)
```javascript
const equityCurve = [
  { date: "2024-01-01", equity: 1000 },
  { date: "2024-02-01", equity: 1085 },
  { date: "2024-03-01", equity: 1210 },
  { date: "2024-04-01", equity: 1180 },
  { date: "2024-05-01", equity: 1350 },
  // ... continua até hoje
  { date: "2025-12-01", equity: 9473 }
]
```

### Monthly Performance
```javascript
const monthlyPerformance = [
  { month: "2024-01", trades: 52, winRate: 65.4, pnlPct: 8.5 },
  { month: "2024-02", trades: 48, winRate: 70.8, pnlPct: 11.5 },
  { month: "2024-03", trades: 55, winRate: 63.6, pnlPct: 6.2 },
  // ... continua
]
```

### Sinal de Exemplo
```javascript
const exampleSignal = {
  id: "sig_001",
  symbol: "SOL",
  direction: "LONG",
  entryPrice: 145.32,
  tpPrice: 151.13,
  tpPct: 4.0,
  holdTime: "48h",
  strength: "STRONG",
  checksPassed: 9,
  totalChecks: 11,
  status: "OPEN", // OPEN, CLOSED_TP, CLOSED_TIME, CLOSED_SL
  currentPrice: 148.50,
  currentPnlPct: 2.19,
  openedAt: "2025-12-11T15:00:00Z",
  closedAt: null,
  exitPrice: null,
  exitReason: null
}
```

---

## ✅ CHECKLIST FINAL PRÉ-LANÇAMENTO

- [ ] Todas as páginas funcionando
- [ ] Checkout testado com cartão real
- [ ] Sinais chegando no Telegram
- [ ] Sinais chegando no Email
- [ ] Mobile funcionando perfeitamente
- [ ] Disclaimer legal revisado por advogado
- [ ] Termos e privacidade publicados
- [ ] SSL funcionando (https)
- [ ] Analytics configurado
- [ ] Backup do banco de dados configurado
- [ ] Plano de contingência se algo quebrar
- [ ] Suporte configurado (email/Telegram)

---

**Última atualização:** 2025-12-12
**Autor:** [Seu Nome]

