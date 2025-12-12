# 📊 Explicação Completa do Sistema de Otimização de Cenários

## 🎯 O que é a Otimização de Cenários?

A otimização de cenários é um **sistema de análise pós-backtest** que responde à pergunta fundamental:

> **"Das 11 condições que verificamos, quais combinações realmente geram os melhores resultados?"**

Enquanto o backtest identifica momentos onde múltiplos indicadores se alinham, a otimização de cenários **analisa o desempenho real** de cada combinação possível dessas condições.

---

## 🔄 Como Funciona o Processo Completo?

### Fluxo de Trabalho

```
1. BACKTEST (backtest_analysis.py)
   ↓
   Gera dados históricos com os 11 checks
   ↓

2. OTIMIZAÇÃO DE CENÁRIOS (scenarios_checker_long_v1.py)
   ↓
   Analisa TODAS as combinações possíveis dos 11 checks
   ↓
   Calcula performance futura (1h, 2h, 4h, 8h, 12h, 24h, 48h, 72h, 96h)
   ↓

3. RESULTADO
   ↓
   Identifica quais combinações realmente funcionam
   Revela padrões não óbvios
   Permite criar estratégias otimizadas
```

---

## 📐 O Conceito de Combinações

### O Problema

Temos 11 condições booleanas (TRUE/FALSE):
1. PA_4H_Trendlines_Resistance (ou PA_1H para 15min/5min)
2. PA_1H_Strong_Bullish_Candle (ou PA_15M/PA_5M)
3. PA_1H_Closed_Above_Resistance (ou PA_15M/PA_5M)
4. Volume_1H_Check (ou Volume_15M/Volume_5M)
5. Volume_Breakout_Support
6. RSI_1H_4H_Check (ou RSI_15M_1H/RSI_5M_1H)
7. MACD_Bullish_Crossover
8. ADX_Trend_Strength
9. ATR_Reasonable_SL
10. OI_Behavior_Check
11. Funding_Rate_Check

### O Universo de Possibilidades

Cada condição pode ser TRUE ou FALSE, então temos:
- **2^11 = 2.048 combinações possíveis**

Exemplo de combinações:
```
TODAS TRUE (11/11):
PA4H_TREND:T | PA1H_BULL:T | PA1H_CLOSE:T | VOL1H:T | VOL_BREAK:T | RSI_CHECK:T | MACD_BULL:T | ADX_TREND:T | ATR_SL:T | OI_CHECK:T | FUND_CHECK:T

SOMENTE PRICE ACTION (3/11):
PA4H_TREND:T | PA1H_BULL:T | PA1H_CLOSE:T | VOL1H:F | VOL_BREAK:F | RSI_CHECK:F | MACD_BULL:F | ADX_TREND:F | ATR_SL:F | OI_CHECK:F | FUND_CHECK:F

SOMENTE VOLUME + TREND (5/11):
PA4H_TREND:F | PA1H_BULL:F | PA1H_CLOSE:F | VOL1H:T | VOL_BREAK:T | RSI_CHECK:T | MACD_BULL:T | ADX_TREND:T | ATR_SL:F | OI_CHECK:F | FUND_CHECK:F
```

---

## 🔍 O que o Sistema Faz?

### 1. **Carregamento de Dados**

O sistema carrega os dados do backtest de duas fontes:

#### Fonte A: Google Sheets (para backtests 1H e 15MIN)
```python
CONFIGS = {
    "SOL": {
        "1H": {
            "spreadsheet_id": "1AkkChZyK3Fi6LNa2cRFjA5i4RxXUYja_7Tk4R86x9yo",
            "worksheet_name": "BACKTEST_SOL_QUANT_LONG",
            "use_excel": False
        },
        "15MIN": {
            "spreadsheet_id": "1zeLpWRt6Sks8xtdtSx2PCF_omWZQVYMjWptpFq92TbA",
            "worksheet_name": "BACKTEST_SOL_15MIN_LONG",
            "use_excel": False
        }
    }
}
```

#### Fonte B: Excel Local (para backtests 5MIN - arquivos grandes)
```python
"5MIN": {
    "excel_path": "/backup_data/backtest_SOL_5min_latest.xlsx",
    "use_excel": True
}
```

**Por que Excel para 5MIN?**
- Backtests de 5 minutos geram MUITO mais dados (12x mais que 1H)
- Google Sheets tem limite de 10 milhões de células
- Excel local é muito mais rápido para arquivos grandes

---

### 2. **Detecção Automática do Tipo de Backtest**

O sistema detecta automaticamente qual tipo de backtest está sendo analisado:

```python
def detect_backtest_type(df: pd.DataFrame) -> str:
    if 'PA_4H_Trendlines_Resistance' in df.columns:
        return '1H'  # Analisa 1h/4h
    elif 'PA_1H_Trendlines_Resistance' in df.columns and 'PA_15M_Strong_Bullish_Candle' in df.columns:
        return '15MIN'  # Analisa 15min/1h
    elif 'PA_1H_Trendlines_Resistance' in df.columns and 'PA_5M_Strong_Bullish_Candle' in df.columns:
        return '5MIN'  # Analisa 5min/1h
```

**Por que isso importa?**
- Cada tipo de backtest usa colunas diferentes
- 1H analisa gráficos de 1 hora e 4 horas
- 15MIN analisa gráficos de 15 minutos e 1 hora
- 5MIN analisa gráficos de 5 minutos e 1 hora
- O sistema adapta automaticamente os nomes das colunas

---

### 3. **Geração de TODAS as Combinações**

```python
def generate_all_variable_combinations(backtest_type: str = '1H'):
    # Gera 2^11 = 2048 combinações
    from itertools import product

    for combination_values in product([True, False], repeat=11):
        # Cria dicionário com cada combinação
        # Pula apenas a combinação com TODAS FALSE (não faz sentido)
```

**Estatísticas por Número de Variáveis TRUE:**

```
 1 variável  TRUE:    11 combinações
 2 variáveis TRUE:    55 combinações
 3 variáveis TRUE:   165 combinações
 4 variáveis TRUE:   330 combinações
 5 variáveis TRUE:   462 combinações
 6 variáveis TRUE:   462 combinações
 7 variáveis TRUE:   330 combinações
 8 variáveis TRUE:   165 combinações
 9 variáveis TRUE:    55 combinações
10 variáveis TRUE:    11 combinações
11 variáveis TRUE:     1 combinação
───────────────────────────────────────
TOTAL:             2,047 combinações
```

---

### 4. **Cálculo de Preços Futuros**

Para cada sinal histórico identificado no backtest, o sistema busca o preço em múltiplos momentos futuros:

```python
def calculate_future_prices_optimized(df: pd.DataFrame, all_data_df: pd.DataFrame, symbol: str = "SOL"):
    # Calcula preços em:
    # 1h, 2h, 4h, 8h, 12h, 24h, 48h, 72h (3 dias), 96h (4 dias)
```

#### Estratégia de Busca Inteligente

**Passo 1: Busca na Planilha (rápido)**
```python
# Tenta encontrar o preço na própria planilha primeiro
price = get_price_from_dataframe(all_data_df, future_time)
```

**Passo 2: Busca na API (fallback)**
```python
# Se não encontrar na planilha, busca na API Hyperliquid
price = get_ohlcv_for_timestamp(symbol, future_time)
```

**Por que essa estratégia?**
- Planilha já tem a maioria dos preços → super rápido
- API só é chamada quando necessário → evita rate limits
- Sistema se auto-otimiza para máxima performance

#### Filtro Inteligente de Dados Recentes

```python
# Só processa análises até 96h (4 dias) antes de agora
now_utc = datetime.now(timezone.utc)
cutoff_datetime = now_utc - timedelta(hours=96)
df_filtered = df[df['DateTime'] <= cutoff_datetime].copy()
```

**Por que filtrar?**
- Análises muito recentes não têm dados futuros completos
- Não faz sentido calcular PNL de 96h para uma análise de ontem
- Economiza processamento e chamadas de API

---

### 5. **Cálculo de PNL (Profit and Loss)**

Para cada sinal, calcula o retorno percentual em cada timeframe:

```python
pnl = ((future_price - entry_price) / entry_price) * 100
```

**Exemplo prático:**
```
Entrada: $100.00
Preço 4h depois: $103.50
PNL_4h_Pct = ((103.50 - 100.00) / 100.00) * 100 = +3.50%

Entrada: $100.00
Preço 24h depois: $98.20
PNL_24h_Pct = ((98.20 - 100.00) / 100.00) * 100 = -1.80%
```

---

### 6. **Análise de Performance por Combinação**

Para cada uma das 2.047 combinações, o sistema calcula:

#### Métricas Básicas
- **Total_Signals:** Quantos sinais foram gerados
- **Signals_with_PNL_{tf}:** Quantos sinais têm dados de PNL para o timeframe

#### Métricas de Retorno
- **avg_pnl_{tf}:** Retorno médio (média aritmética)
- **median_pnl_{tf}:** Retorno mediano (valor do meio)
- **best_trade_{tf}:** Melhor trade (máximo PNL)
- **worst_trade_{tf}:** Pior trade (mínimo PNL)

#### Métricas de Consistência
- **win_rate_{tf}:** Taxa de acerto (% de trades positivos)
- **std_pnl_{tf}:** Desvio padrão (volatilidade dos retornos)

#### Métrica de Risco-Retorno
- **sharpe_ratio_{tf}:** Sharpe Ratio = Retorno Médio / Desvio Padrão

**Interpretação do Sharpe Ratio:**
```
> 2.0:  Excepcional - Excelente retorno com baixo risco
1.0-2.0: Muito Bom - Bom retorno ajustado ao risco
0.5-1.0: Bom - Retorno aceitável para o risco
0.0-0.5: Regular - Retorno baixo para o risco
< 0.0:  Ruim - Perdendo dinheiro
```

---

## 📊 Exemplo de Análise Completa

### Cenário Hipotético

**Combinação:** PA4H_TREND:T | PA1H_BULL:T | VOL1H:T | RSI_CHECK:F | MACD_BULL:F | ADX_TREND:F | ATR_SL:T | OI_CHECK:F | FUND_CHECK:F

**Dados Brutos:**
- 15 sinais gerados no período
- Entrada média: $100

**Resultados 4h:**
```
Preços 4h depois:
Trade 1: $102.50 → PNL: +2.50%
Trade 2: $104.80 → PNL: +4.80%
Trade 3: $98.30  → PNL: -1.70%
Trade 4: $101.20 → PNL: +1.20%
Trade 5: $103.90 → PNL: +3.90%
... (15 trades no total)
```

**Métricas Calculadas:**
```
avg_pnl_4h:      +2.35%
median_pnl_4h:   +2.10%
win_rate_4h:     73.3% (11 de 15 trades positivos)
best_trade_4h:   +8.50%
worst_trade_4h:  -3.20%
std_pnl_4h:      2.80%
sharpe_ratio_4h: 0.84 (2.35 / 2.80)
```

**Interpretação:**
- ✅ Win rate acima de 70% → Consistente
- ✅ Retorno médio positivo → Lucrativo
- ⚠️ Sharpe ratio 0.84 → Bom, mas há volatilidade
- ✅ Mediana próxima da média → Distribuição equilibrada

---

## 🎯 Tipos de Signal Strength

O sistema pode filtrar por força do sinal original do backtest:

### STRONG (≥8/11 checks)
```python
SIGNAL_STRENGTH = 'STRONG'
```
- Analisa apenas sinais onde 8+ condições foram aprovadas
- Mais seletivo, menos sinais
- Geralmente maior win rate

### MODERATE (6-7/11 checks)
```python
SIGNAL_STRENGTH = 'MODERATE'
```
- Sinais com 6-7 condições aprovadas
- Equilíbrio entre quantidade e qualidade

### WEAK (<6/11 checks)
```python
SIGNAL_STRENGTH = 'WEAK'
```
- Sinais com menos de 6 condições
- Mais sinais, mas menor confiabilidade
- Útil para identificar padrões contraintuitivos

### NONE (todos os sinais)
```python
SIGNAL_STRENGTH = 'NONE'
```
- Analisa TODOS os sinais, independente da força
- Visão completa do comportamento do mercado
- Mais demorado, mas mais abrangente

---

## 📁 Estrutura dos Arquivos de Saída

O sistema gera 2 arquivos Excel:

### Arquivo 1: **scenario_optimization_ALL_{symbol}_{data}.xlsx**

**Propósito:** Conferência completa - TODAS as 2.047 combinações

**Estrutura:**
```
Aba: 01_TRUE_VARS
├─ Todas as combinações com 1 variável TRUE
├─ Ordenadas por melhor avg_pnl_24h
└─ Colunas: Rank, ID, Scenario, TRUE/FALSE vars, métricas de todos os timeframes

Aba: 02_TRUE_VARS
├─ Todas as combinações com 2 variáveis TRUE
└─ ...

...

Aba: 11_TRUE_VARS
├─ A única combinação com todas as 11 variáveis TRUE
└─ ...
```

**Colunas principais:**
```
- Rank: Posição no ranking (1 = melhor)
- Combination_ID: ID único da combinação
- Scenario: Nome descritivo com todas as variáveis
- TRUE_Variables: Número de variáveis TRUE
- FALSE_Variables: Número de variáveis FALSE
- Total_Signals: Total de sinais gerados

Para cada timeframe (1h, 2h, 4h, 8h, 12h, 24h, 48h, 72h, 96h):
- AVG_PNL_{tf}_%: Retorno médio
- Signals_PNL_{tf}: Quantos sinais têm dados
- Median_PNL_{tf}_%: Retorno mediano
- Win_Rate_{tf}_%: Taxa de acerto
- Sharpe_Ratio_{tf}: Sharpe ratio
```

---

### Arquivo 2: **scenario_optimization__{symbol}_{data}_{hora}.xlsx**

**Propósito:** Análise focada - APENAS combinações VÁLIDAS (com pelo menos 1 trade)

**Estrutura:**
```
Aba: VALID_1H
├─ TODAS as combinações que têm pelo menos 1 trade em 1h
├─ Ordenadas do MELHOR para o PIOR avg_pnl_1h
└─ Foco total em performance de 1h

Aba: VALID_4H
├─ TODAS as combinações que têm pelo menos 1 trade em 4h
├─ Ordenadas do MELHOR para o PIOR avg_pnl_4h
└─ Foco total em performance de 4h

...

Aba: VALID_96H
├─ TODAS as combinações que têm pelo menos 1 trade em 96h
├─ Ordenadas do MELHOR para o PIOR avg_pnl_96h
└─ Foco total em performance de 96h
```

**Colunas por aba:**
```
- Rank: Posição no ranking específico do timeframe
- Combination_ID: ID único da combinação
- Scenario: Nome descritivo
- TRUE_Variables: Número de variáveis TRUE
- FALSE_Variables: Número de variáveis FALSE
- Total_Signals: Total de sinais gerados
- Signals_with_PNL_{tf}: Sinais com dados para este timeframe
- AVG_PNL_{tf}_%: Retorno médio (critério de ordenação)
- Median_PNL_{tf}_%: Retorno mediano
- Win_Rate_{tf}_%: Taxa de acerto
- Best_Trade_{tf}_%: Melhor trade
- Worst_Trade_{tf}_%: Pior trade
- Std_PNL_{tf}_%: Desvio padrão
- Sharpe_Ratio_{tf}: Sharpe ratio
```

---

## 🔍 Como Interpretar os Resultados?

### 1. **Identificar Padrões Vencedores**

**Exemplo de descoberta:**
```
TOP 3 para 24h:

Rank 1: PA4H_TREND:T | VOL1H:T | VOL_BREAK:T | RSI_CHECK:T | OI_CHECK:T
→ Avg PNL: +4.8%, Win Rate: 78%, Sharpe: 1.2
→ INSIGHT: Volume + OI são mais importantes que MACD/ADX

Rank 2: PA4H_TREND:T | PA1H_BULL:T | VOL1H:T | FUND_CHECK:T
→ Avg PNL: +4.5%, Win Rate: 75%, Sharpe: 1.1
→ INSIGHT: Funding não muito alto é crítico

Rank 3: PA4H_TREND:T | VOL1H:T | RSI_CHECK:T | ADX_TREND:T | ATR_SL:T
→ Avg PNL: +4.3%, Win Rate: 73%, Sharpe: 1.0
→ INSIGHT: Combinação clássica de trend following funciona
```

**O que aprendemos:**
- PA4H_TREND está em TODAS as top 3 → É fundamental
- Volume é mais importante que candle pattern
- OI pode substituir outros indicadores

---

### 2. **Comparar Timeframes**

**Pergunta:** "Qual é o melhor momento para fechar a posição?"

**Análise:**
```
Combinação: PA4H_TREND:T | VOL1H:T | RSI_CHECK:T

1h:  AVG +1.2%, Win 65%, Sharpe 0.5
2h:  AVG +2.1%, Win 68%, Sharpe 0.7
4h:  AVG +3.5%, Win 72%, Sharpe 0.9  ← SWEET SPOT
8h:  AVG +3.8%, Win 71%, Sharpe 0.8
12h: AVG +3.6%, Win 68%, Sharpe 0.7
24h: AVG +2.9%, Win 62%, Sharpe 0.5
```

**Conclusão:**
- Melhor ponto de saída: **4-8 horas**
- Após 8h, retorno estabiliza e win rate cai
- Holding muito tempo reduz performance

---

### 3. **Descobrir Anti-Padrões**

**Pergunta:** "Quais combinações PARECEM boas mas na verdade são ruins?"

**Exemplo:**
```
Combinação: TODAS as 11 variáveis TRUE (11/11)

Total_Signals: 8 sinais em 1 ano
AVG_PNL_24h: +2.1%
Win_Rate_24h: 50%
Sharpe: 0.3

PROBLEMA: Muito seletivo! Perde oportunidades.
```

**Comparado com:**
```
Combinação: Apenas 5 variáveis TRUE (mais relaxada)

Total_Signals: 145 sinais em 1 ano
AVG_PNL_24h: +3.8%
Win_Rate_24h: 68%
Sharpe: 0.9

VANTAGEM: Mais sinais, melhor performance!
```

**Lição:** Mais condições ≠ Melhor resultado. Simplicidade pode vencer.

---

### 4. **Validação Estatística**

**Mínimo de Sinais para Confiabilidade:**

```
< 10 sinais:  ⚠️  Cuidado - Amostra muito pequena, pode ser sorte
10-30 sinais: ⚠️  Aceitável - Ainda pode ter variância alta
30-50 sinais: ✅ Bom - Começa a ter significância estatística
> 50 sinais:  ✅ Excelente - Altamente confiável
```

**Como usar:**
- Priorize combinações com mais sinais
- Desconfie de performances excepcionais com poucos sinais
- Use win rate + Sharpe ratio juntos (não apenas avg_pnl)

---

## 🎓 Casos de Uso Práticos

### Caso 1: "Quero uma estratégia agressiva de 4h"

**Processo:**
1. Abrir `VALID_4H`
2. Filtrar por `Signals_with_PNL_4h >= 50` (mínimo 50 sinais)
3. Ordenar por `AVG_PNL_4h_%` descendente
4. Verificar `Win_Rate_4h_%` (preferir >70%)
5. Conferir `Sharpe_Ratio_4h` (preferir >0.8)

**Resultado esperado:**
```
Cenário escolhido:
PA4H_TREND:T | VOL1H:T | VOL_BREAK:T | RSI_CHECK:T | OI_CHECK:T

Performance:
- 73 sinais em 1 ano
- AVG PNL: +4.2%
- Win Rate: 74%
- Sharpe: 1.1
- Frequência: ~6 sinais/mês
```

---

### Caso 2: "Quero máxima frequência de sinais"

**Processo:**
1. Abrir arquivo `ALL`
2. Aba `03_TRUE_VARS` ou `04_TRUE_VARS` (poucas condições)
3. Ordenar por `Total_Signals` descendente
4. Escolher a que tem melhor `AVG_PNL_4h_%` com sinais suficientes

**Resultado esperado:**
```
Cenário escolhido:
PA4H_TREND:T | VOL1H:T | RSI_CHECK:T

Performance:
- 285 sinais em 1 ano
- AVG PNL: +2.8%
- Win Rate: 64%
- Sharpe: 0.7
- Frequência: ~24 sinais/mês
```

**Trade-off:** Mais sinais, mas menor win rate e retorno médio.

---

### Caso 3: "Quero identificar o que NÃO funciona"

**Processo:**
1. Abrir arquivo `VALID_24H`
2. Ir para o FINAL da lista (piores performances)
3. Analisar padrões comuns

**Descobertas típicas:**
```
❌ Combinações com MACD isolado (sem RSI/ADX) → Win rate <50%
❌ Combinações sem Volume → Muitos falsos breakouts
❌ Combinações sem PA4H_TREND → Sem direção, aleatório
❌ Combinações com Funding muito restritivo → Poucas oportunidades
```

**Uso:** Evitar essas combinações em estratégias futuras.

---

### Caso 4: "Adaptar para diferentes moedas"

**ETH vs SOL vs BTC:**

O sistema permite rodar para diferentes símbolos:
```python
SYMBOL = "ETH"  # ou "BTC", "SOL", "AVAX", "LTC", "SUI"
```

**Descobertas comuns:**
```
BTC (mais estável):
- Precisa menos condições (4-5 TRUE é suficiente)
- Win rate geralmente maior (70-75%)
- Retornos menores (+2-3% em 24h)

SOL (mais volátil):
- Precisa mais confirmações (6-7 TRUE ideal)
- Win rate um pouco menor (65-70%)
- Retornos maiores (+4-6% em 24h)

ETH (balanceado):
- Meio termo entre BTC e SOL
- 5-6 TRUE é ideal
- Win rate 68-72%
- Retornos +3-4% em 24h
```

---

## 🛠️ Configurações Técnicas

### Tipos de Backtest Suportados

#### 1H (Original)
- **Analisa:** Gráficos de 1 hora e 4 horas
- **Fonte:** Google Sheets
- **Colunas:** PA_4H_*, PA_1H_*, Volume_1H_*, RSI_1H_4H_*

#### 15MIN (Novo)
- **Analisa:** Gráficos de 15 minutos e 1 hora
- **Fonte:** Google Sheets
- **Colunas:** PA_1H_*, PA_15M_*, Volume_15M_*, RSI_15M_1H_*

#### 5MIN (Novo)
- **Analisa:** Gráficos de 5 minutos e 1 hora
- **Fonte:** Excel Local (arquivos grandes)
- **Colunas:** PA_1H_*, PA_5M_*, Volume_5M_*, RSI_5M_1H_*

---

### Mapeamento Dinâmico de Colunas

O sistema adapta automaticamente os nomes das colunas:

```python
COLUMN_MAPPING = {
    '1H': {
        'pa_resistance': 'PA_4H_Trendlines_Resistance',
        'pa_candle': 'PA_1H_Strong_Bullish_Candle',
        'volume_check': 'Volume_1H_Check',
        ...
    },
    '15MIN': {
        'pa_resistance': 'PA_1H_Trendlines_Resistance',
        'pa_candle': 'PA_15M_Strong_Bullish_Candle',
        'volume_check': 'Volume_15M_Check',
        ...
    },
    '5MIN': {
        'pa_resistance': 'PA_1H_Trendlines_Resistance',
        'pa_candle': 'PA_5M_Strong_Bullish_Candle',
        'volume_check': 'Volume_5M_Check',
        ...
    }
}
```

**Vantagem:** Mesma lógica de análise para todos os tipos de backtest.

---

## 📈 Performance e Otimizações

### Otimização 1: Cálculo de PNL Uma Vez Só

```python
# ❌ LENTO: Calcular PNL para cada combinação
for combination in all_combinations:
    filtered_df = apply_filter(df, combination)
    calculate_pnl(filtered_df)  # Recalcula tudo!

# ✅ RÁPIDO: Calcular PNL uma vez para toda a base
df_with_pnl = calculate_pnl(df)  # Calcula uma vez
for combination in all_combinations:
    filtered_df = apply_filter(df_with_pnl, combination)  # Só filtra!
```

**Ganho:** ~200x mais rápido (de 4 horas para 1 minuto)

---

### Otimização 2: Busca Inteligente de Preços

```python
# 1. Tenta buscar na planilha (rápido - sem API)
price = get_price_from_dataframe(all_data_df, future_time)

if price is None:
    # 2. Busca na API apenas se necessário
    price = get_ohlcv_for_timestamp(symbol, future_time)
```

**Ganho:** 90% dos preços vêm da planilha → economia de API calls

---

### Otimização 3: Filtro de Dados Recentes

```python
# Só processa análises que têm 96h completas de dados futuros
cutoff_datetime = now_utc - timedelta(hours=96)
df_filtered = df[df['DateTime'] <= cutoff_datetime]
```

**Ganho:** Reduz processamento em ~20% (pula dados muito recentes)

---

### Otimização 4: Rate Limit com Retry

```python
try:
    response = requests.post(url, json=payload, timeout=10)
except TooManyRequests:
    time.sleep(30)  # Pausa 30 segundos
    retry()  # Tenta novamente
```

**Ganho:** Evita perder dados por rate limit, completa o processamento

---

## 🎯 Exemplo de Execução Completa

### Configuração

```python
SYMBOL = "SOL"
BACKTEST_TYPE = "1H"
SIGNAL_STRENGTH = "STRONG"
MAX_COMBINATIONS = None  # Todas
```

### Saída do Console

```
🚀 OTIMIZADOR DE CENÁRIOS DE BACKTEST
==================================================
⚙️  CONFIGURAÇÕES:
   └─ Symbol: SOL
   └─ Backtest Type: 1H
   └─ Signal Strength: STRONG
   └─ Max Combinations: TODAS

📥 Carregando dados da planilha 'BACKTEST_SOL_QUANT_LONG' (1H)...
✅ 2,847 registros carregados com sucesso!
🔍 Tipo de backtest detectado: 1H

📊 Base de dados: 412 registros com STRONG signals

🔢 Gerando combinações para backtest tipo: 1H
🔢 Geradas 2047 combinações (2^11 = 2048):
    1 variáveis TRUE:    11 combinações
    2 variáveis TRUE:    55 combinações
    3 variáveis TRUE:   165 combinações
    ...
   11 variáveis TRUE:     1 combinação

💰 Calculando preços futuros para toda a base de dados...
   📅 Data/hora atual (UTC): 2025-12-11 18:30:00
   ✂️  Cutoff (96h antes): 2025-12-07 18:30:00
   ✅ Registros a processar: 387
   ⏭️  Registros pulados (muito recentes): 25

   📊 10/387: 2025-11-23 15:00
   📊 20/387: 2025-11-24 06:00
   ...
✅ Preços calculados! 142 chamadas da API utilizadas.

🔍 Analisando 2047 combinações...
   📊 Progresso: 200/2047 (9.8%) - Com dados: 187, Sem dados: 13
   📊 Progresso: 400/2047 (19.5%) - Com dados: 362, Sem dados: 38
   ...
✅ Análise concluída!
   📊 Combinações COM dados: 1,834
   📊 Combinações SEM dados: 213
   📊 Total processadas: 2,047

🔹 TOP 5 CENÁRIOS - 24H
┌──────┬──────┬──────────────────────────────────────────────────────────────────────────────┬───────┬─────────┬──────────┬──────────┐
│ Rank │  ID  │ Scenario                                                                     │ TRUE  │ Signals │ Avg PNL  │ Win Rate │
├──────┼──────┼──────────────────────────────────────────────────────────────────────────────┼───────┼─────────┼──────────┼──────────┤
│    1 │  892 │ PA4H_TREND:T | PA1H_BULL:F | PA1H_CLOSE:F | VOL1H:T | VOL_BREAK:T | RSI_... │     6 │      73 │   +4.82% │    74.0% │
│    2 │ 1205 │ PA4H_TREND:T | PA1H_BULL:T | PA1H_CLOSE:F | VOL1H:T | VOL_BREAK:F | RSI_... │     5 │      52 │   +4.51% │    71.2% │
│    3 │  445 │ PA4H_TREND:T | PA1H_BULL:F | PA1H_CLOSE:T | VOL1H:T | VOL_BREAK:F | RSI_... │     7 │      89 │   +4.38% │    73.0% │
│    4 │  238 │ PA4H_TREND:T | PA1H_BULL:F | PA1H_CLOSE:F | VOL1H:F | VOL_BREAK:T | RSI_... │     4 │      35 │   +4.15% │    68.6% │
│    5 │ 1789 │ PA4H_TREND:T | PA1H_BULL:T | PA1H_CLOSE:T | VOL1H:T | VOL_BREAK:T | RSI_... │     8 │     145 │   +4.02% │    72.4% │
└──────┴──────┴──────────────────────────────────────────────────────────────────────────────┴───────┴─────────┴──────────┴──────────┘

💾 Salvando TODOS os resultados em Excel: scenario_optimization_ALL_sol_20251211.xlsx
✅ Aba 01_TRUE_VARS salva com 11 cenários
✅ Aba 02_TRUE_VARS salva com 55 cenários
...
✅ Aba 11_TRUE_VARS salva com 1 cenário
🎉 Arquivo Excel salvo com sucesso!

💾 Salvando TODOS os cenários válidos por timeframe: scenario_optimization__sol_20251211_1830.xlsx
✅ Aba VALID_1H salva com 1,523 cenários válidos
✅ Aba VALID_4H salva com 1,687 cenários válidos
✅ Aba VALID_24H salva com 1,834 cenários válidos
...
🎉 Arquivo VÁLIDOS salvo com sucesso!

🎉 ANÁLISE CONCLUÍDA!
💾 Arquivo Excel COMPLETO: scenario_optimization_ALL_sol_20251211.xlsx
💾 Arquivo Excel VÁLIDOS: scenario_optimization__sol_20251211_1830.xlsx
```

---

## 🧩 Como Usar os Resultados na Prática

### Passo 1: Escolher Estratégia

Baseado em:
- **Objetivo:** Agressivo, conservador, balanceado?
- **Timeframe:** 4h, 24h, ou swing trade (96h)?
- **Frequência:** Muitos sinais ou poucos sinais de alta qualidade?

### Passo 2: Validar Cenário

Verificar:
- ✅ Mínimo 30-50 sinais históricos
- ✅ Win rate >65%
- ✅ Sharpe ratio >0.7
- ✅ Retorno mediano próximo da média (distribuição saudável)

### Passo 3: Implementar

```python
# Extrair as variáveis TRUE do cenário escolhido
# Exemplo: Rank 1 - 24h

ENTRY_CONDITIONS = {
    'PA_4H_Trendlines_Resistance': True,
    'Volume_1H_Check': True,
    'Volume_Breakout_Support': True,
    'RSI_1H_4H_Check': True,
    'OI_Behavior_Check': True,
    'Funding_Rate_Check': True
}

# Ignorar (FALSE):
# - PA_1H_Strong_Bullish_Candle
# - PA_1H_Closed_Above_Resistance
# - MACD_Bullish_Crossover
# - ADX_Trend_Strength
# - ATR_Reasonable_SL
```

### Passo 4: Backtest Adicional

- Testar em dados out-of-sample (período diferente)
- Validar em outros símbolos (ETH, BTC)
- Paper trading por 1-2 semanas

### Passo 5: Live Trading

- Começar com posição pequena (0.5-1% do capital)
- Monitorar performance real vs esperada
- Ajustar se necessário

---

## 💡 Insights Comuns Descobertos

### 1. "Menos é Mais"

Combinações com 5-7 variáveis TRUE geralmente superam as com 10-11 TRUE.

**Por quê?**
- Menos restrições = mais oportunidades
- Evita over-fitting
- Mercado raramente é "perfeito"

---

### 2. "Volume é Rei"

Combinações sem `Volume_1H_Check` raramente têm bom desempenho.

**Por quê?**
- Volume confirma interesse real
- Breakouts sem volume frequentemente falham

---

### 3. "Funding Rate Importa"

`Funding_Rate_Check` está em >80% das top 20 combinações.

**Por quê?**
- Evita entrar em posições "crowded long"
- Reduz risco de short squeeze reverso

---

### 4. "MACD é Opcional"

`MACD_Bullish_Crossover` não aparece em muitas combinações top.

**Por quê?**
- RSI + ADX já capturam momentum
- MACD pode ser redundante
- Simplificação melhora robustez

---

### 5. "Timeframe Sweet Spot"

4-8h geralmente tem melhor risco-retorno que 24h+.

**Por quê?**
- Captura movimento inicial do breakout
- Evita ruído de longo prazo
- Melhor Sharpe ratio

---

## 📚 Glossário Técnico

- **PNL:** Profit and Loss (Lucro ou Prejuízo)
- **Win Rate:** Taxa de acerto (% de trades positivos)
- **Sharpe Ratio:** Retorno ajustado ao risco (maior = melhor)
- **Median:** Valor do meio (menos afetado por outliers que a média)
- **Std Dev:** Desvio padrão (volatilidade)
- **Signal Strength:** Força do sinal original (STRONG/MODERATE/WEAK)
- **Combination:** Configuração específica das 11 variáveis
- **Timeframe:** Período de análise (1h, 4h, 24h, etc.)
- **Rate Limit:** Limite de requisições por tempo
- **API Call:** Chamada à API externa (Hyperliquid)

---

## 🔧 Como Executar

### Configuração Básica

```python
# Editar linha 1277 em scenarios_checker_long_v1.py
SYMBOL = "SOL"           # 'ETH', 'BTC', 'SOL', 'AVAX', 'LTC', 'SUI'
BACKTEST_TYPE = "1H"     # '1H', '15MIN', '5MIN'
```

### Executar

```bash
cd scenarios/
python scenarios_checker_long_v1.py
```

### Tempo Estimado

```
1H backtest (Google Sheets):
- Carregamento: ~10 segundos
- Cálculo PNL: ~2-5 minutos
- Análise combinações: ~30 segundos
- Total: ~3-6 minutos

15MIN backtest (Google Sheets):
- Carregamento: ~15 segundos
- Cálculo PNL: ~5-8 minutos
- Análise combinações: ~30 segundos
- Total: ~6-9 minutos

5MIN backtest (Excel local):
- Carregamento: ~30 segundos
- Cálculo PNL: ~15-25 minutos (muito mais dados!)
- Análise combinações: ~1 minuto
- Total: ~17-27 minutos
```

---

## 🎓 Para Leigos: Analogia Completa

Imagine que você está abrindo uma loja:

### O Backtest (backtest_analysis.py)
É como fazer uma pesquisa de mercado perguntando:
- "Quando as pessoas compram?"
- "Que tipo de cliente compra?"
- "Qual é o melhor horário?"

Você coleta 11 tipos de informações sobre cada momento.

### A Otimização de Cenários (scenarios_checker_long_v1.py)
É como testar TODAS as combinações possíveis de condições:
- "E se eu só abrir quando tiver muito movimento + preço em alta?"
- "E se eu ignorar o horário e focar em clientes recorrentes?"
- "E se eu usar apenas 5 das 11 informações?"

Então você analisa: "Qual combinação realmente gerou mais lucro?"

### O Resultado
Você descobre coisas surpreendentes:
- Abrir todos os dias (muitas condições) não é melhor que abrir 2x por semana (poucas condições)
- Ignorar certos sinais pode AUMENTAR o lucro
- O timing ideal é 4-8 horas, não 24 horas

---

## 📞 Dúvidas Comuns

### "Por que 2.047 combinações e não 2.048?"

Porque a combinação com TODAS FALSE não faz sentido (significa não entrar nunca).

### "Posso usar combinações com poucos sinais?"

Depende. <10 sinais é arriscado (pode ser sorte). >30 é confiável.

### "O melhor cenário sempre funciona?"

Não garantidamente. Backtest mostra o passado, mercado muda. Use validação adicional.

### "Devo sempre usar o Rank 1?"

Não necessariamente. Considere também:
- Frequência de sinais (Rank 1 pode ter poucos)
- Sua tolerância a risco (Sharpe ratio)
- Seu objetivo (scalp, swing, etc.)

### "Como sei se está overfitting?"

Sinais de overfitting:
- Performance excepcional mas poucos sinais
- Muitas variáveis TRUE (>9)
- Performance não se repete em out-of-sample

---

## 🚀 Próximos Passos

Após entender os resultados:

1. **Forward Testing:** Testar em dados mais recentes
2. **Multi-Symbol:** Validar em outros ativos
3. **Walk-Forward:** Testar em janelas deslizantes
4. **Paper Trading:** Simular em tempo real
5. **Live Trading:** Implementar com capital real (pequeno)

---

**Última atualização:** 2025-12-11
**Versão:** 3.0
**Autor:** Quant Analysis Team
