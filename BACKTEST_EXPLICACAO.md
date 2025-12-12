# 📊 Explicação Completa do Backtest de Estratégia LONG

## 🎯 O que é este Backtest?

Este backtest simula uma estratégia de trading para **posições LONG** (apostando na subida do preço) em criptomoedas. Ele analisa dados históricos hora por hora para identificar os melhores momentos de entrada em uma operação de compra.

**Objetivo principal:** Identificar momentos onde múltiplos indicadores técnicos e de mercado se alinham para indicar uma alta probabilidade de movimento de preço para cima.

---

## 🔍 Como o Backtest Funciona?

### Processo Geral

1. **Carregamento de Dados Históricos**
   - O sistema carrega dados de **Funding Rate** (taxa de financiamento) e **Open Interest** (interesse aberto) de um período extenso (ex: desde 01/01/2024)
   - Estes dados são essenciais para entender o sentimento do mercado

2. **Seleção do Período de Análise**
   - Normalmente, analisa o dia anterior (das 01:00 até 00:00 do dia seguinte)
   - Cada hora é tratada como um potencial ponto de entrada

3. **Execução de 11 Verificações (Checks)**
   - Para cada hora, o sistema verifica 11 condições diferentes
   - Cada check avalia um aspecto específico do mercado

4. **Classificação do Sinal**
   - **🟢 STRONG** (≥8 checks): Alta probabilidade de sucesso
   - **🟡 MODERATE** (6-7 checks): Probabilidade média, aguardar mais confirmações
   - **🔴 WEAK** (<6 checks): Baixa probabilidade, não entrar

---

## 📋 Os 11 Checks Explicados

### 1️⃣ **Price Action 4H - Trendlines/Resistência**

**O que verifica:** Se o preço está em tendência de alta no gráfico de 4 horas E próximo de romper uma resistência importante.

**Dados utilizados:**
- 100 velas de 4 horas (~400 horas = ~16 dias de histórico)
- Cada vela mostra: preço abertura, máxima, mínima, fechamento

**Como funciona:**
1. Calcula a inclinação da tendência (slope) dos últimos 10 candles
2. Identifica os 3 maiores máximos (topos) dos últimos 30 candles
3. Calcula um nível de resistência com média ponderada (dando mais peso ao topo mais recente)
4. Verifica se o preço atual está a menos de 0.2% abaixo da resistência

**Por que isso importa para LONG:**
- Tendência de alta indica momentum positivo
- Estar próximo da resistência sugere que o preço pode romper para cima (breakout)
- Um breakout bem-sucedido geralmente leva a movimentos fortes de alta

**Exemplo prático:**
```
Resistência calculada: $3,000
Preço atual: $2,994 (99.8% da resistência)
✅ APROVADO - Preço está tocando a resistência e pode romper
```

---

### 2️⃣ **Price Action 1H - Candle Forte de Alta**

**O que verifica:** Se a última vela de 1 hora é um candle forte de alta, sem muita rejeição no topo.

**Dados utilizados:**
- 10 velas de 1 hora (últimas 10 horas)
- Foco na última vela completa

**Como funciona:**
1. Analisa a última vela:
   - **Corpo (body):** Diferença entre abertura e fechamento
   - **Range total:** Diferença entre máxima e mínima
   - **Pavio superior (upper wick):** Distância entre o topo da vela e o fechamento/abertura
   - **Pavio inferior (lower wick):** Distância entre o fundo da vela e o fechamento/abertura

2. Critérios para candle forte:
   - Corpo > 60% do range total (vela tem corpo grande)
   - Pavio superior < 25% do range total (pouca rejeição no topo)
   - Preço de fechamento > preço de abertura (vela verde)

**Por que isso importa para LONG:**
- Candle forte mostra convicção dos compradores
- Pavio superior pequeno indica que vendedores não conseguiram derrubar o preço
- Compradores dominaram toda a hora

**Exemplo visual:**
```
Vela FORTE de alta:          Vela FRACA de alta:
    ↑ (pavio pequeno)            ↑↑↑ (pavio grande = rejeição)
   ███ (corpo grande)             █
   ███                            █
   ███                            █
    ↓                             ↓
```

---

### 3️⃣ **Price Action 1H - Fechou Acima da Resistência**

**O que verifica:** Se a última vela de 1 hora fechou acima do nível de resistência identificado no check #1.

**Dados utilizados:**
- Preço de fechamento da última vela de 1H
- Nível de resistência calculado no check #1 (4H)

**Como funciona:**
1. Compara o preço de fechamento com o nível de resistência
2. Se fechamento > resistência → Breakout confirmado

**Por que isso importa para LONG:**
- Um fechamento acima da resistência confirma o rompimento (não é apenas um "spike" temporário)
- Breakouts confirmados frequentemente levam a movimentos prolongados de alta
- A resistência anterior vira suporte (zona de proteção)

**Exemplo prático:**
```
Resistência: $3,000
Fechamento 1H: $3,005
✅ BREAKOUT CONFIRMADO - Preço rompeu e se manteve acima
```

---

### 4️⃣ **Volume 1H - Spike de Volume**

**O que verifica:** Se o volume da última vela de 1 hora está significativamente acima da média (geralmente >150% da média de 5 dias).

**Dados utilizados:**
- 150 velas de 1 hora (~6 dias de histórico)
- Volume de cada vela (quantidade negociada)

**Como funciona:**
1. Calcula a média de volume das últimas 120 velas (5 dias)
2. Compara o volume da última vela com esta média
3. Verifica se está acima do multiplicador configurado (ex: 1.5x, 1.6x)

**Multiplicadores por símbolo:**
- ETH: 1.5x (volume deve ser 50% maior que média)
- BTC: 1.3x (mais líquido, aceita multiplicador menor)
- SOL: 1.6x (mais volátil, exige spike maior)
- SUI: 1.65x

**Por que isso importa para LONG:**
- Volume alto confirma que há interesse real no movimento
- Breakouts com volume alto têm maior probabilidade de sucesso
- Volume baixo indica movimento "falso" sem convicção

**Exemplo prático:**
```
Média 5 dias: 1,000,000
Volume atual: 1,600,000
Ratio: 1.6x
✅ APROVADO - Volume 60% acima da média
```

---

### 5️⃣ **Breakout + Volume**

**O que verifica:** Se a última vela é VERDE (fechou acima da abertura) E tem spike de volume (#4 aprovado).

**Dados utilizados:**
- Preço de abertura e fechamento da última vela 1H
- Resultado do check #4 (volume)

**Como funciona:**
1. Verifica se fechamento > abertura (vela verde)
2. Verifica se há spike de volume
3. Ambos devem estar presentes

**Por que isso importa para LONG:**
- Combina direção (alta) com convicção (volume)
- Vela verde + volume = compradores dominando com força
- É um dos sinais mais confiáveis de continuação de alta

**Exemplo:**
```
Abertura: $2,990
Fechamento: $3,010
Volume: 1.6x média
✅ APROVADO - Vela verde com volume forte
```

---

### 6️⃣ **RSI 1H/4H - Acima de 50 e Subindo**

**O que verifica:** Se o RSI (Relative Strength Index) em ambos os timeframes está acima de 50 E está subindo.

**Dados utilizados:**
- 100 velas de 1 hora para calcular RSI 1H
- 100 velas de 4 horas para calcular RSI 4H
- Período de cálculo: 14 períodos (padrão RSI)

**Como funciona:**
1. Calcula RSI atual e RSI anterior para cada timeframe
2. Verifica se ambos estão acima do limite mínimo (50-52 dependendo do símbolo)
3. Verifica se ambos estão subindo (RSI atual > RSI anterior)

**Limites mínimos por símbolo:**
- ETH/BTC/LTC: RSI > 50
- SOL/AVAX/SUI: RSI > 52 (mais conservador)

**Por que isso importa para LONG:**
- RSI > 50 indica que compradores estão no controle
- RSI subindo mostra momentum crescente
- Confirmação em 2 timeframes reduz falsos sinais

**Escala RSI:**
```
0-30:  Oversold (sobrevendido) - possível reversão para cima
30-50: Zona neutra/baixista
50-70: Zona neutra/altista ← Queremos estar aqui
70-100: Overbought (sobrecomprado) - cuidado com reversão
```

**Exemplo:**
```
RSI 1H: 55 (anterior: 52) ✅ Subindo
RSI 4H: 58 (anterior: 56) ✅ Subindo
Ambos > 50: ✅
```

---

### 7️⃣ **MACD - Crossover Bullish**

**O que verifica:** Se o MACD (Moving Average Convergence Divergence) acabou de fazer um cruzamento de alta no timeframe de 1H.

**Dados utilizados:**
- 100 velas de 1 hora
- MACD calculado com parâmetros padrão (12, 26, 9)

**Como funciona:**
1. MACD tem 3 componentes:
   - **Linha MACD:** EMA(12) - EMA(26)
   - **Linha Signal:** EMA(9) do MACD
   - **Histograma:** MACD - Signal

2. Crossover bullish ocorre quando:
   - Histograma atual > 0 (MACD cruzou acima da Signal)
   - Histograma anterior ≤ 0 (estava abaixo ou neutro)

**Por que isso importa para LONG:**
- MACD é excelente para identificar mudanças de momentum
- Crossover bullish indica que a tendência de curto prazo está acelerando para cima
- É um sinal de entrada clássico usado por traders profissionais

**Exemplo visual:**
```
Tempo →
        ↗ MACD (linha rápida)
       ↗
      ↗
     ↗ → Signal (linha lenta)
    ↗
   ↗

Quando MACD cruza acima da Signal = COMPRAR
```

---

### 8️⃣ **ADX - Força de Tendência**

**O que verifica:** Se o ADX (Average Directional Index) no timeframe 4H está acima de 20, indicando tendência forte.

**Dados utilizados:**
- 100 velas de 4 horas
- ADX calculado com período 14

**Como funciona:**
1. ADX mede a FORÇA da tendência (não a direção)
2. Escala:
   - **0-20:** Tendência fraca ou ausente (mercado lateral)
   - **20-25:** Tendência moderada
   - **25-50:** Tendência forte
   - **50+:** Tendência muito forte

**Limites mínimos por símbolo:**
- ETH/BTC/LTC: ADX > 20
- SOL/AVAX/SUI: ADX > 22 (exige tendência um pouco mais forte)

**Por que isso importa para LONG:**
- Em mercados sem tendência (ADX < 20), breakouts frequentemente falham
- ADX > 20 confirma que há uma tendência real acontecendo
- Combinado com outros indicadores, confirma que a alta não é "ruído"

**Exemplo:**
```
ADX = 15: ❌ Mercado lateral, evitar entradas
ADX = 25: ✅ Tendência forte, seguro para operar
ADX = 45: ✅ Tendência muito forte, momento ideal
```

---

### 9️⃣ **ATR - Volatilidade Razoável**

**O que verifica:** Se o ATR (Average True Range) está abaixo de um threshold, indicando que um stop loss razoável não ficará muito largo.

**Dados utilizados:**
- 50 velas de 1 hora
- ATR calculado com período 14

**Como funciona:**
1. ATR mede a volatilidade média (range das velas)
2. Calcula ATR como % do preço atual
3. Verifica se está abaixo do limite máximo

**Thresholds por símbolo:**
- LTC: 1.6% (menos volátil)
- BTC: 2.0%
- SOL: 2.5%
- SUI: 2.8% (mais volátil)

**Por que isso importa para LONG:**
- ATR muito alto = stop loss precisa ser muito largo = risco alto
- ATR razoável = podemos usar stop loss apertado = melhor relação risco/retorno
- Evita entrar em momentos de volatilidade extrema (maior risco de whipsaw)

**Exemplo prático:**
```
Preço: $3,000
ATR: $60
ATR%: 2% (60/3000)
Threshold: 2.5%
✅ APROVADO - Volatilidade permite stop loss razoável em ~2%
```

---

### 🔟 **Open Interest - Aumento Significativo**

**O que verifica:** Se o Open Interest (OI) aumentou mais de 1.5-1.8 desvios padrão em relação às últimas 14 mudanças horárias.

**Dados utilizados:**
- Últimos 14+ registros de Open Interest (dados horários)
- Open Interest atual

**Como funciona:**
1. Calcula a mudança percentual do OI hora a hora
2. Pega as últimas 14 mudanças percentuais
3. Calcula média e desvio padrão dessas mudanças
4. Verifica se a mudança atual > (oi_sigma × desvio padrão)

**Multiplicadores OI sigma por símbolo:**
- ETH/BTC/LTC: 1.5 σ
- AVAX: 1.6 σ
- SOL: 1.7 σ
- SUI: 1.8 σ (exige aumento mais significativo)

**Por que isso importa para LONG:**
- OI crescente = mais traders abrindo posições = interesse crescente
- Aumento significativo (acima da média) indica convicção institucional
- OI estável ou caindo durante alta = sinal fraco, possível armadilha

**Exemplo prático:**
```
Últimas 14 mudanças de OI: [0.5%, -0.3%, 0.8%, 0.2%, ...]
Média: 0.3%
Desvio padrão: 0.5%
Threshold (1.5σ): 0.75%
Mudança atual: 1.2%
✅ APROVADO - OI aumentou 1.2% (muito acima do threshold de 0.75%)
```

---

### 1️⃣1️⃣ **Funding Rate - Não Muito Alto**

**O que verifica:** Se a soma dos últimos 8 Funding Rates (representando 8 horas) está abaixo de um limite, evitando posições "crowded long".

**Dados utilizados:**
- Últimos 8 valores de Funding Rate (8 horas de histórico)
- Cada valor representa a taxa de 1 hora

**Como funciona:**
1. Pega os últimos 8 valores de Funding Rate
2. Soma todos (representa custo de manter posição long por 8h)
3. Verifica se está abaixo do threshold E se não é negativo

**Thresholds por símbolo:**
- BTC: 0.0004 (0.04%)
- ETH/LTC: 0.0005 (0.05%)
- SOL/AVAX: 0.0006 (0.06%)
- SUI: 0.0007 (0.07%)

**O que é Funding Rate:**
- Taxa paga entre traders long e short em futuros perpétuos
- Positivo = longs pagam shorts (muitos compradores)
- Negativo = shorts pagam longs (muitos vendedores)

**Por que isso importa para LONG:**
- FR muito alto = mercado lotado de longs = risco de squeeze
- FR moderado = espaço para mais compradores entrarem
- FR muito negativo = possível bottom, mas aguardamos virada

**Exemplo prático:**
```
Últimos 8 FRs: [0.00008, 0.00007, 0.00009, 0.00008, 0.00007, 0.00008, 0.00009, 0.00007]
Soma: 0.00063 (0.063%)
Threshold: 0.0005 (0.05%)
❌ REPROVADO - Funding muito alto, posição crowded
```

**Interpretação:**
- Soma < 0.01%: Mercado balanceado, ideal para long
- Soma 0.01-0.05%: Aceitável
- Soma > 0.05%: Cuidado, muitos longs (depende do símbolo)

---

## ⚙️ Configurações por Símbolo

Cada criptomoeda tem características próprias de volatilidade e liquidez, por isso usamos parâmetros ajustados:

### 🟦 **ETH (Ethereum)**
```
Volume Multiplier: 1.5x     - Aceita spike moderado
ATR Threshold: 1.5%         - Baixa volatilidade esperada
Funding Threshold: 0.05%    - Nível médio
RSI Mínimo: 50              - Padrão
ADX Mínimo: 20              - Padrão
OI Sigma: 1.5               - Padrão
```
**Perfil:** Ativo líquido e relativamente estável. Configurações balanceadas.

---

### 🟧 **BTC (Bitcoin)**
```
Volume Multiplier: 1.3x     - Aceita spike menor (muito líquido)
ATR Threshold: 2.0%         - Aceita volatilidade maior
Funding Threshold: 0.04%    - Mais restritivo
RSI Mínimo: 50              - Padrão
ADX Mínimo: 20              - Padrão
OI Sigma: 1.5               - Padrão
```
**Perfil:** Ativo mais líquido do mercado. Volume menor já é significativo. Volatilidade aceitável maior.

---

### 🟪 **SOL (Solana)**
```
Volume Multiplier: 1.6x     - Exige spike maior
ATR Threshold: 2.5%         - Alta volatilidade aceitável
Funding Threshold: 0.06%    - Mais permissivo
RSI Mínimo: 52              - Mais conservador
ADX Mínimo: 22              - Tendência mais forte exigida
OI Sigma: 1.7               - Exige mudança maior de OI
```
**Perfil:** Ativo mais volátil. Exige confirmações mais fortes e aceita volatilidade maior.

---

### 🔴 **AVAX (Avalanche)**
```
Volume Multiplier: 1.55x
ATR Threshold: 2.3%
Funding Threshold: 0.06%
RSI Mínimo: 52
ADX Mínimo: 22
OI Sigma: 1.6
```
**Perfil:** Similar ao SOL, mas ligeiramente menos volátil.

---

### ⚪ **LTC (Litecoin)**
```
Volume Multiplier: 1.35x
ATR Threshold: 1.6%
Funding Threshold: 0.05%
RSI Mínimo: 50
ADX Mínimo: 20
OI Sigma: 1.5
```
**Perfil:** Ativo mais estável e menos volátil que BTC/ETH.

---

### 🔵 **SUI**
```
Volume Multiplier: 1.65x    - Exige maior spike
ATR Threshold: 2.8%         - Maior volatilidade aceitável
Funding Threshold: 0.07%    - Mais permissivo
RSI Mínimo: 52              - Conservador
ADX Mínimo: 22              - Tendência forte
OI Sigma: 1.8               - Maior mudança exigida
```
**Perfil:** Ativo mais novo e volátil. Parâmetros mais conservadores para evitar falsos sinais.

---

## 🎓 Por Que Estes Checks Para Estratégia LONG?

### Filosofia da Estratégia

A estratégia busca entrar em LONG quando múltiplos fatores se alinham:

1. **Price Action (Checks 1-3):** Confirma que o preço está tecnicamente pronto para subir
2. **Volume (Checks 4-5):** Confirma que há interesse real e convicção
3. **Momentum (Checks 6-8):** Confirma que a tendência está acelerando
4. **Risk Management (Check 9):** Garante que o risco é controlável
5. **Market Sentiment (Checks 10-11):** Confirma que não há desequilíbrio perigoso

### Por Que Múltiplos Checks?

**Princípio de Confluência:** Quando vários indicadores independentes apontam para a mesma direção, a probabilidade de sucesso aumenta exponencialmente.

**Exemplo:**
- 1 check aprovado: ~50% de chance de sucesso
- 3 checks aprovados: ~60% de chance
- 6 checks aprovados: ~70% de chance
- 8+ checks aprovados: ~80%+ de chance

### Por Que Timeframes 1H e 4H?

- **4H:** Fornece visão de médio prazo, identifica tendências e resistências principais
- **1H:** Fornece timing preciso de entrada, confirma que o momentum está presente AGORA
- Combinação dos dois reduz falsos sinais e melhora taxa de acerto

---

## 📊 Fontes de Dados

### Dados OHLCV (Preço e Volume)

**Fonte 1 - JSONL Local (Padrão):**
- Arquivos locais com dados históricos pré-baixados
- Vantagens: Super rápido, sem limite de requisições
- Localização: `/historical_data/{timeframe}/{SYMBOL}_{timeframe}.jsonl`

**Fonte 2 - Binance API (Fallback):**
- API oficial da Binance
- Vantagens: Dados sempre atualizados
- Desvantagens: Limite de requisições, mais lento

**Fonte 3 - Hyperliquid API (Alternativa):**
- API da Hyperliquid
- Usada se configurado `USE_BINANCE = False`

### Dados de Funding Rate e Open Interest

**Fonte:** Google Sheets via API
- Worksheet específica por símbolo: `FR_OI_HISTORICAL_{SYMBOL}`
- Dados horários de FR e OI
- Alimentado por script separado de coleta

---

## 🏗️ Estrutura do Código

### Funções Principais

1. **`run_full_backtest(symbol)`**
   - Função principal que orquestra todo o processo
   - Carrega dados históricos
   - Itera por cada hora do período
   - Chama análise para cada timestamp

2. **`run_backtest_analysis(symbol, target_datetime, ...)`**
   - Executa os 11 checks para um datetime específico
   - Retorna dicionário com todos os resultados

3. **`check_price_action_4h_backtest()`**
   - Implementa check #1

4. **`check_price_action_1h_backtest()`**
   - Implementa checks #2 e #3

5. **`check_volume_confirmation_backtest()`**
   - Implementa checks #4 e #5

6. **`check_trend_indicators_backtest()`**
   - Implementa checks #6, #7 e #8

7. **`check_volatility_backtest()`**
   - Implementa check #9

8. **`check_open_interest_behavior_backtest()`**
   - Implementa check #10

9. **`check_funding_rate_conditions_backtest()`**
   - Implementa check #11

### Funções de Dados

- **`get_kline_backtest()`**: Busca candles com fallback inteligente (JSONL → API)
- **`load_jsonl_data()`**: Carrega dados locais com cache em memória
- **`get_historical_fr_oi_data()`**: Busca dados de FR/OI do Google Sheets

### Funções de Cálculo

- **`calculate_rsi()`**: Calcula RSI usando TA-Lib
- **`calculate_macd()`**: Calcula MACD usando TA-Lib
- **`calculate_adx()`**: Calcula ADX usando TA-Lib
- **`calculate_atr()`**: Calcula ATR usando TA-Lib

---

## 🎯 Interpretação dos Resultados

### Classificação dos Sinais

**🟢 STRONG SIGNAL (≥8/11 checks)**
- Alta probabilidade de movimento de alta
- Todos os fatores principais estão alinhados
- **Ação sugerida:** Considerar entrada LONG

**🟡 MODERATE SIGNAL (6-7/11 checks)**
- Probabilidade média
- Alguns fatores ainda não confirmados
- **Ação sugerida:** Aguardar mais confirmações ou entrar com posição reduzida

**🔴 WEAK SIGNAL (<6/11 checks)**
- Baixa probabilidade de sucesso
- Muitos fatores não estão alinhados
- **Ação sugerida:** NÃO entrar, aguardar melhor momento

### Exemplos de Relatório

```
📊 RELATÓRIO DE ANÁLISE TÉCNICA - SOL [BACKTEST]
💰 Preço: $145.32
⏰ DateTime: 2024-11-23T15:00:00

🔹 PRICE ACTION
✅ Trendlines/Resistência (4H): ✅
   └─ Slope da tendência: 0.045623 (Bullish)
   └─ Resistência: $145.00
   └─ Preço vs Resistência: 1.0022 (Acima)

✅ Candle forte de alta (1H): ✅
   └─ Corpo do candle: 68.2% (Forte)
   └─ Pavio superior: 18.3% (Baixo)

✅ Fechou acima da resistência: ✅
   └─ Breakout confirmado

...

🔹 RESUMO FINAL
✅ Verificações aprovadas: 9/11 (81.8%)

🟢 STRONG SIGNAL FOR LONG - Condições favoráveis!
```

---

## 💡 Dicas para Leigos

### O que você precisa entender:

1. **Mais checks aprovados = maior probabilidade de sucesso**
   - Pense como uma "lista de checagem" antes de decolar um avião
   - Todos os sistemas devem estar OK

2. **Cada check avalia algo diferente**
   - Alguns olham preço, outros volume, outros sentimento do mercado
   - Juntos, dão uma visão 360° do mercado

3. **Timeframes diferentes = perspectivas diferentes**
   - 4H = "Qual é a tendência geral?"
   - 1H = "É a hora certa de entrar AGORA?"

4. **Configurações diferentes por moeda**
   - Cada criptomoeda tem personalidade própria
   - BTC é como um navio (mais estável), SUI é como um jet ski (mais volátil)

5. **Volume é rei**
   - Movimento de preço sem volume = falso
   - Movimento de preço com volume = real e sustentável

### Como usar este backtest:

1. **Backtesting (o que este script faz):**
   - Testa a estratégia em dados passados
   - Descobre se a estratégia teria funcionado historicamente
   - Ajusta parâmetros para melhorar taxa de acerto

2. **Trading ao vivo (próximo passo):**
   - Usa a mesma lógica em tempo real
   - Quando aparecer sinal STRONG → considerar entrada
   - Sempre usar stop loss baseado no ATR

---

## 📈 Próximos Passos

Após o backtest identificar padrões de sucesso:

1. **Análise de Performance**
   - Quantos sinais STRONG realmente resultaram em lucro?
   - Qual a média de retorno por sinal?
   - Qual o drawdown máximo?

2. **Otimização**
   - Ajustar thresholds para melhorar taxa de acerto
   - Adicionar novos checks se necessário
   - Remover checks que não agregam valor

3. **Validação Forward**
   - Testar estratégia em dados mais recentes (out-of-sample)
   - Garantir que não houve overfitting

4. **Implementação Live**
   - Usar a mesma lógica para gerar sinais em tempo real
   - Adicionar sistema de alertas
   - Integrar com exchange para execução automática (opcional)

---

## ⚠️ Avisos Importantes

1. **Backtest não garante resultados futuros**
   - Mercado muda constantemente
   - Performance passada ≠ performance futura

2. **Sempre use stop loss**
   - Mesmo sinais STRONG podem falhar
   - Proteja seu capital

3. **Risk management é fundamental**
   - Não arrisque mais de 1-2% do capital por trade
   - Diversifique entre diferentes ativos

4. **Este backtest considera apenas aspectos técnicos**
   - Não considera notícias, eventos macroeconômicos, hacks, etc.
   - Na prática, esses fatores também importam

---

## 📚 Glossário Técnico

- **OHLCV:** Open, High, Low, Close, Volume (abertura, máxima, mínima, fechamento, volume)
- **RSI:** Relative Strength Index (mede força do movimento)
- **MACD:** Moving Average Convergence Divergence (mede momentum)
- **ADX:** Average Directional Index (mede força da tendência)
- **ATR:** Average True Range (mede volatilidade)
- **OI:** Open Interest (total de contratos futuros abertos)
- **FR:** Funding Rate (taxa entre longs e shorts)
- **EMA:** Exponential Moving Average (média móvel exponencial)
- **Breakout:** Rompimento de resistência ou suporte
- **Long:** Posição comprada (aposta na alta)
- **Short:** Posição vendida (aposta na queda)
- **Timeframe:** Período de cada vela (1H = 1 hora, 4H = 4 horas)
- **Sigma (σ):** Desvio padrão (medida estatística de dispersão)

---

## 🔧 Como Executar

```bash
# 1. Instalar dependências
pip install pandas numpy talib requests python-dotenv binance-connector

# 2. Configurar variáveis de ambiente (.env)
BINANCE_API_KEY=sua_chave
BINANCE_API_SECRET=seu_secret

# 3. Executar backtest
python backtest_analysis.py
```

**Ou editar linha 1534 do código:**
```python
if __name__ == "__main__":
    symbol = "SOL"  # Altere para BTC, ETH, etc.
    run_full_backtest(symbol)
```

---

## 📞 Suporte

Para dúvidas ou sugestões sobre este backtest, consulte a documentação do código ou entre em contato com a equipe de desenvolvimento.

---

**Última atualização:** 2025-12-11
**Versão:** 2.0
**Autor:** Quant Analysis Team
