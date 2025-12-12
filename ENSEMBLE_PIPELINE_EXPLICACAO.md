# 📊 Explicação Completa do Ensemble Trading Pipeline

## 🎯 O que é o Ensemble Trading Pipeline?

O Ensemble Trading Pipeline é um **sistema de simulação de trading real** que transforma os melhores cenários identificados na otimização em um **trading log completo**, simulando como seria se você tivesse realmente apostado nessas combinações.

> **Diferença fundamental:**
> - **Otimização de Cenários:** Analisa métricas isoladas (win rate, avg PNL, etc.)
> - **Ensemble Pipeline:** Simula capital real, posições sobrepostas, take profit, stop loss, e gerenciamento de risco

---

## 🔄 Como Funciona o Pipeline Completo?

### Fluxo de Trabalho

```
1. OTIMIZAÇÃO DE CENÁRIOS (scenarios_checker_long_v1.py)
   ↓
   Identifica as melhores combinações (ex: top 40 para SOL)
   ↓

2. CONFIGURAÇÃO DE CENÁRIOS (SC_scenario_extractor_long.py)
   ↓
   Define quais combinações usar no ensemble
   ↓

3. EXTRAÇÃO DE SINAIS
   ↓
   Busca TODOS os momentos históricos onde qualquer cenário foi ativado
   ↓

4. SIMULAÇÃO DE TRADES (PNL_calc_all_scenario.py)
   ↓
   Simula trades reais com:
   - Capital inicial ($1,000)
   - Posições sobrepostas (múltiplos trades simultâneos)
   - Take Profit / Stop Loss
   - Ratchet SL (trailing stop)
   - Fees + Slippage
   - Leverage
   ↓

5. SALVAMENTO NO SHEETS (run_ensemble_pipeline.py)
   ↓
   Gera planilha completa com:
   - Histórico de todos os trades
   - Curva de equity
   - Métricas consolidadas
   - Gráficos automáticos
   - Análises por sinal
   - Análises mensais
```

---

## 📋 Componentes do Sistema

### 1. **SC_scenario_extractor_long.py** - Configuração de Cenários

**Propósito:** Define quais cenários (combinações) serão usados no ensemble.

#### Estrutura da Configuração

```python
CONFIGS = {
    "SOL": {
        "spreadsheet_id": "...",
        "worksheet_name": "BACKTEST_SOL_QUANT_LONG",
        "hold_time": "48h",  # Tempo de holding padrão
        "NY_SESSION_TIME": False,  # Filtrar apenas horário NY (13:00-21:00 UTC)
        "scenarios": {
            1908: "PA4H_TREND:F | PA1H_BULL:F | PA1H_CLOSE:F | VOL1H:T | ...",
            2040: "PA4H_TREND:F | PA1H_BULL:F | PA1H_CLOSE:F | VOL1H:F | ...",
            # ... mais 38 cenários
        }
    }
}
```

**Como escolher os cenários:**

1. Abrir resultado da otimização (ex: `scenario_optimization__sol_20251211.xlsx`)
2. Selecionar top 20-40 cenários por timeframe relevante
3. Copiar o `Combination_ID` e a string de cenário
4. Adicionar no dicionário `scenarios`

**Exemplo prático:**
```
Excel mostra:
Rank: 1
ID: 1908
Scenario: PA4H_TREND:F | PA1H_BULL:F | ...
AVG_PNL_48h: +4.82%
Win_Rate_48h: 74.0%

→ Adicionar ao CONFIGS:
1908: "PA4H_TREND:F | PA1H_BULL:F | PA1H_CLOSE:F | VOL1H:T | VOL_BREAK:F | ..."
```

---

#### Função Principal: `extract_scenarios_as_dataframe()`

**O que faz:**
1. Carrega dados do backtest do Google Sheets
2. Filtra APENAS registros que atendem a QUALQUER um dos cenários configurados
3. Calcula PNL para cada registro
4. Retorna DataFrame pronto para simulação

**Exemplo de saída:**
```
DataFrame com 1,247 registros:
┌─────────────────────┬────────┬───────┬────────┬─────────┐
│ DateTime            │ Symbol │ Signal│ Price  │ PNL_48h │
├─────────────────────┼────────┼───────┼────────┼─────────┤
│ 2024-11-23 15:00:00 │ SOL    │ 1908  │ 145.32 │ +4.50%  │
│ 2024-11-23 16:00:00 │ SOL    │ 2040  │ 145.87 │ -1.20%  │
│ 2024-11-23 18:00:00 │ SOL    │ 1912  │ 146.45 │ +3.80%  │
│ ...                 │ ...    │ ...   │ ...    │ ...     │
└─────────────────────┴────────┴───────┴────────┴─────────┘
```

---

### 2. **PNL_calc_all_scenario.py** - Simulação de Trades

**Propósito:** Motor de simulação que processa trades com realismo total.

#### Configurações do Simulador

```python
INITIAL_CAPITAL = 1_000.0       # Capital inicial em USD
BET_PERCENTAGE = 0.10            # 10% do capital DISPONÍVEL por trade
LEVERAGE = 10                    # Alavancagem 10x
FEE_RATE = 0.0006                # 0.06% de taxa (entrada + saída)
SLIPPAGE_RATE = 0.001319         # 0.1319% de slippage
```

---

#### Como Funciona a Simulação

##### A. **Capital Disponível e Posições Sobrepostas**

**Conceito:** Capital diminui conforme abre posições, volta quando fecham.

**Exemplo:**
```
Início: Capital Disponível = $1,000

Trade 1 abre (15:00):
- Alocação: 10% × $1,000 = $100
- Capital Disponível: $900
- Posições abertas: 1

Trade 2 abre (16:00):
- Alocação: 10% × $900 = $90
- Capital Disponível: $810
- Posições abertas: 2

Trade 1 fecha (16:30) com +5% lucro:
- PNL: +$5
- Capital Disponível: $810 + $105 = $915
- Posições abertas: 1

Trade 3 abre (17:00):
- Alocação: 10% × $915 = $91.50
- Capital Disponível: $823.50
- Posições abertas: 2
```

**Por que isso importa:**
- Simula realidade: você NÃO tem capital infinito
- Máximo de posições abertas é limitado pelo capital
- Momentos de muitos sinais simultâneos afetam alocação

---

##### B. **Cálculo de PNL com Fees e Slippage**

**Fórmula completa:**

```python
# 1. Preço de entrada (com slippage de compra)
entry_price_with_slippage = entry_price * (1 + SLIPPAGE_RATE)

# 2. Preço de saída (com slippage de venda)
exit_price_with_slippage = exit_price * (1 - SLIPPAGE_RATE)

# 3. Quantidade de contratos (com leverage)
position_size = (allocated_capital * LEVERAGE) / entry_price_with_slippage

# 4. PNL bruto
pnl_gross = (exit_price_with_slippage - entry_price_with_slippage) * position_size

# 5. Fees (entrada + saída)
fee_entry = allocated_capital * LEVERAGE * FEE_RATE
fee_exit = (exit_price_with_slippage * position_size) * FEE_RATE
total_fees = fee_entry + fee_exit

# 6. PNL líquido
pnl_net = pnl_gross - total_fees
```

**Exemplo numérico:**
```
Capital alocado: $100
Leverage: 10x
Entry price: $145.00
Exit price (48h): $150.00
Slippage: 0.1319%
Fee: 0.06%

1. Entry com slippage: $145.00 × 1.001319 = $145.19
2. Exit com slippage: $150.00 × 0.998681 = $149.80
3. Position size: ($100 × 10) / $145.19 = 6.887 contratos
4. PNL bruto: ($149.80 - $145.19) × 6.887 = $31.74
5. Fees:
   - Entry: $1,000 × 0.0006 = $0.60
   - Exit: ($149.80 × 6.887) × 0.0006 = $0.62
   - Total: $1.22
6. PNL líquido: $31.74 - $1.22 = $30.52

Retorno: +30.52% sobre os $100 alocados
```

---

##### C. **Hold Time e Gerenciamento de Posições**

**Hold Time:** Tempo que a posição fica aberta se não atingir TP ou SL.

**Configurações por símbolo:**
```python
"SOL": {"hold_time": "48h"}  # 2 dias
"BTC": {"hold_time": "72h"}  # 3 dias
"ETH": {"hold_time": "48h"}  # 2 dias
```

**Como funciona:**
```
Trade abre: 2024-11-23 15:00
Hold time: 48h
Fecha automaticamente: 2024-11-25 15:00 (se não atingir TP/SL antes)
```

---

##### D. **Take Profit (TP)**

**Propósito:** Fecha automaticamente quando lucro atinge um alvo.

**Configuração:**
```python
"SOL": {
    "take_profit_enabled": True,
    "take_profit_pct": 4.0  # Fecha com +4% de lucro
}
```

**Como funciona:**
1. A cada 10 minutos (ou conforme granularidade dos dados), verifica preço atual
2. Se `price_change_pct >= 4.0%`, fecha a posição imediatamente
3. PNL = lucro de 4% menos fees e slippage

**Exemplo:**
```
Entry: $145.00
TP: 4%
Preço alvo: $145.00 × 1.04 = $150.80

2024-11-23 15:00 - Abre posição: $145.00
2024-11-23 18:30 - Preço: $150.92 → TP atingido!
Fecha posição com +4% (menos fees/slippage)
```

---

##### E. **Stop Loss (SL) Fixo**

**Propósito:** Limita perdas fechando automaticamente quando prejuízo atinge limite.

**Configuração:**
```python
"BTC": {
    "stop_loss_enabled": True,
    "stop_loss_pct": 2.0  # Fecha com -2% de prejuízo
}
```

**Como funciona:**
1. A cada 10 minutos, verifica preço atual
2. Se `price_change_pct <= -2.0%`, fecha a posição imediatamente
3. PNL = prejuízo de -2% menos fees e slippage

**Exemplo:**
```
Entry: $90,000
SL: -2%
Preço de stop: $90,000 × 0.98 = $88,200

2024-11-23 15:00 - Abre posição: $90,000
2024-11-23 17:15 - Preço: $88,150 → SL atingido!
Fecha posição com -2% (menos fees/slippage)
```

---

##### F. **Ratchet SL (Trailing Stop Avançado)**

**Propósito:** Stop loss dinâmico que acompanha o lucro, protegendo ganhos.

**Como funciona:**

O Ratchet SL é um sistema de **10 tiers** que ajusta o SL conforme o preço sobe.

**Configuração:**
```python
"SOL": {
    "sl_ratchet_enabled": True
}
```

**Tiers de Stop Loss (modo porcentagem):**

```
Quando lucro >= 10% → SL sobe para entry + 5.0%
Quando lucro >= 9%  → SL sobe para entry + 4.5%
Quando lucro >= 8%  → SL sobe para entry + 4.0%
Quando lucro >= 7%  → SL sube para entry + 3.5%
Quando lucro >= 6%  → SL sobe para entry + 3.0%
Quando lucro >= 5%  → SL sobe para entry + 2.5%
Quando lucro >= 4%  → SL sobe para entry + 2.0%
```

**Exemplo completo:**
```
Entry: $145.00
SL inicial: None (só ativa quando em lucro)

15:00 - Abre: $145.00
16:00 - Preço: $148.50 (+2.4%) → Sem mudança no SL
17:00 - Preço: $151.00 (+4.1%) → SL ativa em $145 + 2% = $147.90
18:00 - Preço: $154.00 (+6.2%) → SL sobe para $145 + 3% = $149.35
19:00 - Preço: $160.00 (+10.3%) → SL sobe para $145 + 5% = $152.25
20:00 - Preço cai para $152.00 → SL não é atingido (está acima de $152.25)
21:00 - Preço cai para $151.50 → SL ATINGIDO!

Fecha posição com ~+4.5% (de $145 para $151.50)
```

**Benefícios:**
- Protege lucros quando preço sobe muito
- Evita dar back todo o ganho quando preço reverte
- Ajusta dinamicamente conforme volatilidade (usa ATR também)

**Spike Emergencial:**
Se ATR de 30 minutos >= 1.3 × ATR de 1 hora (volatilidade extrema):
- Move SL para próximo do preço atual
- Protege contra quedas bruscas

---

##### G. **Post-Entry Analytics**

**Propósito:** Analisa o comportamento do preço APÓS a entrada.

**Métricas calculadas:**

1. **Pct_Runup (% run-up até High):**
   - Maior % de lucro atingido durante a posição
   - Mede potencial máximo de ganho

2. **Pct_Drawdown (% run-down até Low):**
   - Maior % de prejuízo atingido durante a posição
   - Mede risco máximo suportado

3. **H_or_L_First (High ou Low primeiro):**
   - "H": Máximo foi atingido antes do mínimo
   - "L": Mínimo foi atingido antes do máximo
   - Indica se trade começou com movimento favorável

4. **Time_to_H_hours (Tempo até High):**
   - Quantas horas até atingir o máximo
   - Mede velocidade do movimento de alta

5. **Time_to_L_hours (Tempo até Low):**
   - Quantas horas até atingir o mínimo
   - Mede quando ocorreu maior risco

**Exemplo:**
```
Entry: 2024-11-23 15:00 @ $145.00
Exit: 2024-11-25 15:00 @ $150.00 (48h depois)

Durante as 48h:
- Máximo: $158.50 (17h após entrada)
- Mínimo: $142.80 (8h após entrada)

Métricas:
- Pct_Runup: +9.31% ((158.50 - 145.00) / 145.00)
- Pct_Drawdown: -1.52% ((142.80 - 145.00) / 145.00)
- H_or_L_First: "L" (mínimo veio primeiro)
- Time_to_H_hours: 17.0
- Time_to_L_hours: 8.0

Interpretação:
- Trade começou mal (caiu -1.52% primeiro)
- Depois recuperou e subiu até +9.31%
- Fechou com lucro de +3.45%
- TP de 4% não foi atingido (faltaram 0.55%)
```

**Por que isso é valioso:**
- Revela se TP/SL estão bem calibrados
- Mostra se vale a pena segurar posição mais tempo
- Identifica padrões de movimento pós-entrada

---

### 3. **run_ensemble_pipeline.py** - Orquestração e Salvamento

**Propósito:** Pipeline principal que conecta tudo e salva no Google Sheets.

#### Funções Principais

##### A. `run_ensemble_pipeline_main(symbol)`

**Orquestra todo o processo:**

```python
def run_ensemble_pipeline_main(symbol: str):
    # 1. Extrair cenários
    df_scenarios = extract_scenarios_as_dataframe(
        start_date=None,  # Todas as datas
        end_date=None,
        calculate_pnl=True,
        symbol=symbol
    )

    # 2. Processar trades com simulação completa
    trades, stats, curve = process_trades_interval(
        df_scenarios,
        interval="48h",  # ou "72h" para BTC
        symbol=symbol,
        tp_enabled=True,
        tp_pct=4.0,
        sl_enabled=False,
        sl_pct=2.0,
        sl_ratchet_enabled=True
    )

    # 3. Preparar dados para Sheets
    trades_df = prepare_trades_for_sheets(trades)

    # 4. Salvar no Google Sheets
    save_trades_to_sheets(
        trades_df,
        curve,
        stats,
        "SOL_Long_Trades",
        symbol
    )
```

---

##### B. `save_trades_to_sheets()` - Salvamento Avançado

**O que salva:**

1. **Aba Principal com Trades:**
```
┌─────────────────────┬────────┬───────┬───────────┬──────────┬─────────┬─────────┐
│ Entry_Date          │ Symbol │ Signal│ Entry_Px  │ Exit_Px  │ PNL_USD │ Status  │
├─────────────────────┼────────┼───────┼───────────┼──────────┼─────────┼─────────┤
│ 2024-11-23 15:00:00 │ SOL    │ 1908  │ 145.32    │ 150.87   │ +$35.20 │ CLOSED  │
│ 2024-11-23 16:00:00 │ SOL    │ 2040  │ 145.87    │ 144.12   │ -$8.40  │ CLOSED  │
│ ...                 │ ...    │ ...   │ ...       │ ...      │ ...     │ ...     │
└─────────────────────┴────────┴───────┴───────────┴──────────┴─────────┴─────────┘

Colunas completas (48 no total):
- Entry_Date, Entry_Time, Exit_Date, Exit_Time
- Symbol, Signal, Signal_Strength
- Entry_Price, Exit_Price, Entry_Price_Slippage, Exit_Price_Slippage
- Allocated_Capital, Position_Size, Leverage
- PNL_USD, PNL_Pct, Price_Change_Pct_Slippage
- Fee_Entry, Fee_Exit, Slippage_Entry, Slippage_Exit
- Equity_Before, Equity_After, Available_Capital_Before, Available_Capital_After
- Open_Positions_Before, Open_Positions_After
- Status, Exit_Reason
- TP_Price, TP_Hit, SL_Price, SL_Hit, Ratchet_SL_Final
- Pct_Runup, Pct_Drawdown, H_or_L_First, Time_to_H_hours, Time_to_L_hours
- ... e mais
```

2. **Seção: Chart Equity Data**
```
=== Chart Equity Data ===
┌─────────────────────┬─────────────┐
│ DateTime            │ Equity_USD  │
├─────────────────────┼─────────────┤
│ 2024-11-23 15:00:00 │ 1000.00     │
│ 2024-11-23 16:00:00 │ 1035.20     │
│ 2024-11-23 17:00:00 │ 1026.80     │
│ ...                 │ ...         │
│ 2025-12-10 18:00:00 │ 1,847.32    │
└─────────────────────┴─────────────┘
```

3. **Seção: Trading Metrics (coluna C)**
```
=== Trading Metrics ===
┌───────────────────────────┬────────────┐
│ Metric                    │ Value      │
├───────────────────────────┼────────────┤
│ Total PNL                 │ $847.32    │
│ Final Equity              │ $1,847.32  │
│ Initial Equity            │ $1,000.00  │
│ Total Return %            │ 84.73%     │
│ Max Equity                │ $1,923.45  │
│ Min Equity                │ $982.15    │
│ Max Drawdown              │ 4.21%      │
│ Max DD Date               │ 2024-12-15 │
│ DD Peak Value             │ $1,850.00  │
│ DD Bottom Value           │ $1,772.07  │
│ DD Loss Amount            │ $77.93     │
│ Win Rate                  │ 68.3%      │
│ Avg % Price Change        │ +2.45%     │
│ Median % Price Change     │ +1.80%     │
│ Total Trades              │ 247        │
│ Winning Trades            │ 169        │
│ Losing Trades             │ 78         │
│ Profit Factor             │ 2.14       │
├───────────────────────────┼────────────┤
│ === Post-Entry Analytics ===           │
│ Avg % run-up to High      │ +5.82%     │
│ Median % run-up to High   │ +4.35%     │
│ Avg % run-down to Low     │ -2.18%     │
│ Median % run-down to Low  │ -1.65%     │
│ % Low hit first           │ 42.5%      │
│ % High hit first          │ 57.5%      │
│ Avg time to High (h)      │ 18.3       │
│ Median time to High (h)   │ 14.5       │
│ Avg time to Low (h)       │ 8.7        │
│ Median time to Low (h)    │ 6.2        │
└───────────────────────────┴────────────┘
```

4. **Seção: Per-Signal Analytics**
```
=== Per-Signal Analytics ===
┌────────┬────────┬──────────┬────────────┬─────────────┬────────────┬────────────────┬─────────┐
│ Signal │ Trades │ Win Rate │ Profit Fct │ Avg Pr Chg │ Avg Runup  │ Worst Trade %  │ % True  │
├────────┼────────┼──────────┼────────────┼─────────────┼────────────┼────────────────┼─────────┤
│ 1908   │ 23     │ 73.9%    │ 2.45       │ +3.12%      │ +6.35%     │ -5.21% (Nov 28)│ 27.3%   │
│ 2040   │ 18     │ 61.1%    │ 1.83       │ +1.85%      │ +4.82%     │ -3.45% (Dec 3) │ 9.1%    │
│ 1912   │ 31     │ 71.0%    │ 2.28       │ +2.95%      │ +5.98%     │ -4.10% (Dec 8) │ 27.3%   │
│ ...    │ ...    │ ...      │ ...        │ ...         │ ...        │ ...            │ ...     │
└────────┴────────┴──────────┴────────────┴─────────────┴────────────┴────────────────┴─────────┘

+ Colunas com as 11 variáveis (T/F) de cada cenário
```

5. **Seção: Monthly Analytics**
```
=== Monthly Analytics ===
┌────────────┬──────┬──────────────┬───────────┬──────────┬────────────────┬─────────────────┐
│ Month      │ Year │ Total Trades │ Win Rate  │ Sum PNL  │ Sum Price Chg  │ Avg Price Chg   │
├────────────┼──────┼──────────────┼───────────┼──────────┼────────────────┼─────────────────┤
│ December   │ 2025 │ 8            │ 75.0%     │ +$42.15  │ +28.35%        │ +3.54%          │
│ November   │ 2025 │ 45           │ 68.9%     │ +$183.20 │ +124.80%       │ +2.77%          │
│ October    │ 2025 │ 52           │ 67.3%     │ +$201.45 │ +138.95%       │ +2.67%          │
│ ...        │ ...  │ ...          │ ...       │ ...      │ ...            │ ...             │
└────────────┴──────┴──────────────┴───────────┴──────────┴────────────────┴─────────────────┘
```

6. **Gráfico Automático de Equity**
- Criado automaticamente na coluna AE, linha 2
- Gráfico de linha mostrando evolução do equity
- Título: "{SYMBOL} Ensemble Trading - Equity Evolution (48h)"

---

## 📊 Métricas e KPIs Calculados

### Métricas Principais

#### 1. **Total PNL**
```
Soma de todos os PNL líquidos (com fees e slippage)
```

#### 2. **Total Return %**
```
((Final Equity - Initial Equity) / Initial Equity) × 100
```

#### 3. **Win Rate**
```
(Trades positivos / Total de trades) × 100
```

#### 4. **Profit Factor**
```
Soma de ganhos / Soma de perdas

> 2.0: Excelente
1.5-2.0: Muito bom
1.0-1.5: Aceitável
< 1.0: Perdendo dinheiro
```

#### 5. **Max Drawdown**
```
Maior queda % do pico ao vale

Exemplo:
Pico: $1,850
Vale: $1,772.07
Drawdown: (1850 - 1772.07) / 1850 × 100 = 4.21%
```

#### 6. **Sharpe Ratio** (implícito nos dados)
```
Retorno médio / Desvio padrão dos retornos

Baseado nos PNL individuais de cada trade
```

---

### Métricas Post-Entry

#### 7. **Avg % run-up to High**
```
Média do maior lucro % atingido em cada trade

Exemplo: Se em média os trades sobem +5.82% no pico,
mas você fecha com +3.5%, está deixando +2.32% na mesa
```

#### 8. **Avg % run-down to Low**
```
Média do maior prejuízo % atingido em cada trade

Exemplo: Se em média cai -2.18%, mas seu SL está em -2%,
você está pegando quase todo o drawdown máximo
```

#### 9. **% Low hit first**
```
% de trades onde o mínimo foi atingido antes do máximo

Alto valor (>50%) = trades começam contra você
Baixo valor (<40%) = trades começam a favor
```

#### 10. **Avg time to High/Low**
```
Tempo médio até atingir máximo e mínimo

Útil para calibrar hold time:
- Se Time to High = 14h, hold time de 48h está OK
- Se Time to High = 40h, talvez precisar de hold time maior
```

---

## 🎯 Como Usar o Sistema

### Passo 1: Rodar Otimização de Cenários

```bash
cd scenarios/
python scenarios_checker_long_v1.py
```

**Resultado:**
- `scenario_optimization__sol_20251211_1830.xlsx`
- Identifica top cenários por timeframe

---

### Passo 2: Selecionar Cenários para Ensemble

**Critérios de seleção:**

1. **Timeframe relevante:**
   - Para hold time 48h → usar aba `VALID_48H`
   - Para hold time 72h → usar aba `VALID_72H`

2. **Métricas mínimas:**
   - Win Rate ≥ 65%
   - Sharpe Ratio ≥ 0.7
   - Signals with PNL ≥ 20 (amostra mínima)

3. **Diversificação:**
   - Não usar apenas cenários com muitas variáveis TRUE
   - Misturar diferentes estilos (volume-based, trend-based, etc.)

**Exemplo de seleção para SOL (48h):**
```
Top 40 cenários da aba VALID_48H:
- Rank 1-10: Alta performance (avg PNL >4%)
- Rank 11-25: Performance média (avg PNL 3-4%)
- Rank 26-40: Performance OK (avg PNL 2-3%)
```

---

### Passo 3: Configurar SC_scenario_extractor_long.py

Editar o arquivo:
```python
"SOL": {
    "scenarios": {
        1908: "PA4H_TREND:F | PA1H_BULL:F | ...",
        2040: "PA4H_TREND:F | PA1H_BULL:F | ...",
        # ... adicionar os 40 cenários selecionados
    }
}
```

---

### Passo 4: Configurar Parâmetros de Trading

Editar `run_ensemble_pipeline.py`:

```python
CONFIGS = {
    "SOL": {
        "hold_time": "48h",
        "take_profit_enabled": True,
        "take_profit_pct": 4.0,  # TP em +4%
        "stop_loss_enabled": False,  # SL fixo desativado
        "sl_ratchet_enabled": True,  # Ratchet SL ativado
    }
}
```

**Recomendações:**

**Para ativos voláteis (SOL, AVAX, SUI):**
```python
"take_profit_pct": 4.0-5.0  # TP mais alto
"sl_ratchet_enabled": True   # Proteger lucros
```

**Para ativos estáveis (BTC, ETH):**
```python
"take_profit_pct": 2.0-3.0  # TP mais conservador
"sl_ratchet_enabled": False  # Pode segurar posição
```

---

### Passo 5: Executar Pipeline

```bash
cd scenarios/
python run_ensemble_pipeline.py
```

**Saída do console:**
```
🚀 SOL ENSEMBLE TRADING PIPELINE (48H)
════════════════════════════════════════════════════════════

📊 PASSO 1: Extraindo cenários SOL...
✅ 1,247 registros extraídos dos cenários SOL

🎯 PASSO 2: Processando trades para 48h (SOL ensemble)...
   🎯 Take Profit ativado: 4.0%
   🔧 Ratchet SL ativado: ajuste a cada 10min baseado em ATR
✅ 247 trades processados
   └─ Curva de equity: 1,247 pontos

📋 PASSO 3: Preparando dados para Sheets...
✅ Dados preparados: 247 linhas

💾 PASSO 4: Salvando no Google Sheets...
   🗑️  Deletando aba existente 'SOL_Long_Trades'...
   ➕ Criando nova aba 'SOL_Long_Trades' completamente limpa...
   📝 Preparando dados: 247 linhas + cabeçalhos...
   📊 Adicionando dados de equity para gráfico...
   📈 Adicionando tabela de métricas importantes...
   ⬆️  Enviando dados para Google Sheets...
   ✅ Primeira linha congelada e filtro aplicado!
   📊 Tentando criar gráfico automaticamente...
   📍 Posicionando gráfico na coluna AE, linha 2 (topo da página)
✅ Gráfico criado automaticamente na planilha!
✅ Trades salvos com sucesso na aba 'SOL_Long_Trades'!
   └─ Total de trades: 247
   └─ Colunas: 48
   └─ Dados de equity: 1,247 pontos
   └─ Tabela de métricas adicionada (coluna C)
   └─ Gráfico criado automaticamente na coluna AE, linha 2! 📊
   └─ Timestamp: 2025-12-11 18:45:23
   └─ Aba deletada e recriada completamente (dados + gráficos limpos) ✨

🎉 PIPELINE SOL CONCLUÍDO COM SUCESSO!
📈 Estatísticas finais (48h):
   └─ Total PNL: $847.32
   └─ Win Rate: 68.3%
   └─ Total Trades: 247
   └─ Final Equity: $1,847.32
   └─ Max Drawdown: 4.21% em 2024-12-15 16:00
       ├─ Pico antes: $1,850.00
       ├─ Valor mínimo: $1,772.07
       └─ Perda: $77.93 (4.21%)
💾 Dados salvos na planilha: SOL_Long_Trades
📊 Gráfico de equity criado automaticamente na planilha!
```

---

### Passo 6: Analisar Resultados no Google Sheets

**Link da planilha:**
```
https://docs.google.com/spreadsheets/d/1U11uj31CVTUTrZYFwV4XIagaI0slwYU2FS3StXM_Quw
```

**Abas disponíveis:**
- `SOL_Long_Trades`
- `BTC_Long_Trades`
- `ETH_Long_Trades`
- `AVAX_Long_Trades`
- `LTC_Long_Trades`
- `SUI_Long_Trades`

**Como analisar:**

1. **Visão Geral (Coluna C):**
   - Total Return: quanto o capital cresceu?
   - Win Rate: estratégia é consistente?
   - Max Drawdown: qual o pior momento?
   - Profit Factor: lucros superam perdas?

2. **Gráfico de Equity (Coluna AE):**
   - Curva está subindo consistentemente?
   - Há períodos de grande volatilidade?
   - Drawdowns são recuperados rapidamente?

3. **Post-Entry Analytics (Coluna C):**
   - Avg Runup vs TP: está deixando lucro na mesa?
   - Avg Drawdown vs SL: está pegando muito risco?
   - % Low first: trades começam bem ou mal?
   - Time to High: hold time está correto?

4. **Per-Signal Analytics (Colunas C+):**
   - Quais sinais têm melhor Win Rate?
   - Quais sinais têm melhor Profit Factor?
   - Algum sinal está puxando performance para baixo?
   - % True/False: qual perfil de cenário funciona melhor?

5. **Monthly Analytics (Colunas C+):**
   - Há meses consistentemente bons?
   - Há meses ruins (sazonalidade)?
   - Performance está melhorando ou piorando?

---

## 🔬 Análises Avançadas

### 1. **Comparação de Configurações**

**Teste A/B de Take Profit:**

```python
# Teste 1: TP 3%
"SOL": {"take_profit_pct": 3.0}
→ Executar pipeline
→ Anotar: Total Return, Win Rate, Avg Time in Trade

# Teste 2: TP 4%
"SOL": {"take_profit_pct": 4.0}
→ Executar pipeline
→ Comparar métricas

# Teste 3: TP 5%
"SOL": {"take_profit_pct": 5.0}
→ Executar pipeline
→ Qual teve melhor Sharpe Ratio?
```

---

### 2. **Análise de Cenários Individuais**

**Pergunta:** "Qual cenário contribui mais para o lucro?"

**Método:**
1. Abrir `Per-Signal Analytics`
2. Ordenar por `Win Rate` descendente
3. Verificar `Total Trades` (precisa ter volume suficiente)
4. Identificar top 5 cenários

**Exemplo de descoberta:**
```
Top 5 cenários SOL:
1. Signal 1908: Win Rate 73.9%, 23 trades, Profit Factor 2.45
2. Signal 1912: Win Rate 71.0%, 31 trades, Profit Factor 2.28
3. Signal 763: Win Rate 69.5%, 19 trades, Profit Factor 2.12
4. Signal 2040: Win Rate 61.1%, 18 trades, Profit Factor 1.83
5. Signal 1852: Win Rate 65.2%, 27 trades, Profit Factor 1.95

Ação: Aumentar peso desses cenários no ensemble (adicionar variações)
```

---

### 3. **Análise de Sazonalidade**

**Pergunta:** "Há meses melhores para operar?"

**Método:**
1. Abrir `Monthly Analytics`
2. Comparar `Win Rate` e `Avg Price Chg` por mês
3. Identificar padrões

**Exemplo:**
```
January: Win Rate 58%, Avg Chg +1.8%  ← Fraco
February: Win Rate 72%, Avg Chg +3.2% ← Forte!
March: Win Rate 65%, Avg Chg +2.5%    ← OK
...
November: Win Rate 74%, Avg Chg +3.8% ← Forte!
December: Win Rate 61%, Avg Chg +2.1% ← Fraco

Padrão: Inverno (Nov-Feb) melhor que verão (Jun-Aug)
Ação: Aumentar alocação no inverno, reduzir no verão
```

---

### 4. **Otimização de Hold Time**

**Pergunta:** "48h é o melhor hold time ou deveria ser maior/menor?"

**Método:**
1. Olhar `Avg time to High` e `Median time to High`
2. Comparar com hold time atual

**Exemplo:**
```
SOL com hold_time 48h:
- Avg time to High: 18.3h
- Median time to High: 14.5h
- Max time to High observado: 42h

Conclusão: 48h está OK, captura a maioria dos picos (95% em <42h)

Se Avg time to High fosse 55h:
→ Precisaria aumentar hold time para 72h
```

---

### 5. **Análise de Drawdown**

**Pergunta:** "Qual foi o pior período e por quê?"

**Método:**
1. Verificar `Max DD Date` em Trading Metrics
2. Filtrar trades daquele período
3. Analisar quais sinais falharam

**Exemplo:**
```
Max DD: 4.21% em 2024-12-15 16:00
Pico: $1,850 → Vale: $1,772.07

Filtrar trades de 2024-12-14 a 2024-12-16:
- 8 trades abertos nesse período
- 6 fecharam com prejuízo
- Sinais que falharam: 2040, 1528, 1920 (todos sem PA4H_TREND)

Conclusão: Mercado estava lateral/em queda (sem tendência clara)
Ação: Considerar adicionar filtro de trend strength global
```

---

## 💡 Melhores Práticas

### 1. **Não Fazer Over-Optimization**

❌ **Errado:**
```
Testar 100 configurações diferentes de TP/SL
Escolher a melhor
→ Overfitting! Não vai funcionar no futuro
```

✅ **Correto:**
```
Definir 3-5 configurações razoáveis
Testar todas
Escolher a mais robusta (não a melhor)
→ Generalização! Maior chance de funcionar
```

---

### 2. **Diversificar Cenários**

❌ **Errado:**
```
Usar apenas cenários com PA4H_TREND:T (todos similares)
→ Ensemble não tem diversificação
```

✅ **Correto:**
```
Misturar cenários:
- 40% com trend (PA4H_TREND:T)
- 30% com volume (VOL1H:T)
- 30% com mean reversion (PA4H_TREND:F)
→ Ensemble robusto para diferentes market conditions
```

---

### 3. **Validar em Out-of-Sample**

❌ **Errado:**
```
Usar dados de 2024-01-01 a 2025-12-31 para tudo
→ Sem validação independente
```

✅ **Correto:**
```
1. Otimizar cenários em 2024-01-01 a 2025-06-30 (in-sample)
2. Testar ensemble em 2025-07-01 a 2025-12-31 (out-of-sample)
3. Se performance out-of-sample ≥ 70% da in-sample → OK
```

---

### 4. **Monitorar Degradação**

```
Comparar performance por trimestre:

Q1 2024: Return +22%, Win Rate 72%
Q2 2024: Return +18%, Win Rate 69%
Q3 2024: Return +15%, Win Rate 67% ← Degredando!
Q4 2024: Return +12%, Win Rate 64%

Ação: Re-otimizar cenários a cada 3-6 meses
```

---

### 5. **Backtest vs Forward Test**

**Backtest:** Passado perfeito
**Forward Test:** Futuro real (live/paper)

```
Backtest: +84% return, 68% win rate

Forward Test (3 meses):
- Mês 1: +4.2% (expectativa: +7%)  → OK (60% da expectativa)
- Mês 2: -1.8% (expectativa: +7%)  → Ruim (market condition ruim)
- Mês 3: +9.1% (expectativa: +7%)  → Ótimo!

Total: +11.5% em 3 meses (46% anualizado vs 84% no backtest)
→ 54% de slippage entre backtest e realidade → NORMAL
```

---

## 🚨 Limitações e Considerações

### 1. **Slippage Real vs Simulado**

**Simulado:** 0.1319% fixo
**Real:** Varia conforme:
- Liquidez do momento
- Tamanho da ordem
- Volatilidade
- Exchange

**Impacto:** Slippage real pode ser 2-3x maior em momentos de alta volatilidade.

---

### 2. **Execução Perfeita**

**Simulado:** Assume que todas as ordens são executadas
**Real:** Ordens podem:
- Não preencher (limit orders)
- Preencher parcialmente
- Preencher com piores preços (market orders em alta volatilidade)

---

### 3. **Posições Sobrepostas**

**Simulado:** Permite quantas posições o capital permitir
**Real:** Exchanges têm:
- Limite de posições abertas
- Requisitos de margem que mudam
- Risk management automático que pode fechar posições

---

### 4. **Funding Rates Não Incluídos**

**Simulado:** Não considera funding rates de futuros perpétuos
**Real:** Paga/recebe funding rate a cada 8h

**Impacto:** Posições longas em bull market pagam funding (custo adicional)

---

### 5. **Market Condition Changes**

**Simulado:** Assume que padrões se repetem
**Real:** Mercado evolui, padrões degradam

**Solução:** Re-otimizar a cada 3-6 meses

---

## 📚 Glossário Técnico

- **Ensemble:** Conjunto de múltiplos cenários operando juntos
- **Equity Curve:** Curva que mostra evolução do capital ao longo do tempo
- **Drawdown:** Queda do pico ao vale (mede risco)
- **Runup:** Subida do entry ao pico (mede potencial)
- **Slippage:** Diferença entre preço esperado e preço executado
- **Leverage:** Multiplicador de posição (10x = posição 10 vezes maior que capital)
- **Take Profit (TP):** Ordem automática que fecha posição no lucro alvo
- **Stop Loss (SL):** Ordem automática que fecha posição no prejuízo máximo
- **Ratchet SL:** Stop loss dinâmico que acompanha o lucro (trailing stop)
- **ATR:** Average True Range (mede volatilidade)
- **Post-Entry Analytics:** Análise do comportamento da posição após entrada
- **H_or_L_First:** Indicador se máximo ou mínimo veio primeiro
- **Profit Factor:** Ratio de ganhos totais / perdas totais

---

## 🎓 Para Leigos: Analogia Completa

### Processo Todo Explicado com Loja

**1. Otimização de Cenários (scenarios_checker)**
```
"Você fez uma pesquisa de mercado e descobriu:
- Abrir aos sábados + ter promoção = 74% de lucro
- Abrir de manhã + servir café = 68% de lucro
- Abrir à noite + música ao vivo = 71% de lucro
(40 combinações diferentes testadas)"
```

**2. Configuração de Cenários (SC_scenario_extractor)**
```
"Você decide usar as 40 melhores combinações juntas:
- Alguns dias você abre de manhã com café
- Outros dias você abre à noite com música
- Alguns dias você faz promoção
Depende do que cada 'sinal' indicar"
```

**3. Simulação de Trades (PNL_calc_all_scenario)**
```
"Você simula o que teria acontecido:
- Capital inicial: $1,000
- Cada vez que abre a loja: investe 10% do dinheiro disponível
- Às vezes várias 'filiais' abertas ao mesmo tempo
- Cada filial tem resultado diferente (+5%, -2%, +8%, etc.)
- Capital vai crescendo ou diminuindo baseado nos resultados"
```

**4. Salvamento no Sheets (run_ensemble_pipeline)**
```
"Você cria uma planilha detalhada:
- Lista de todas as vezes que abriu loja (trades)
- Quanto investiu em cada uma
- Quanto lucrou ou perdeu
- Gráfico mostrando crescimento do capital ao longo do tempo
- Análise de qual 'combinação' funcionou melhor"
```

---

## 🔧 Como Executar (Resumo)

```bash
# 1. Otimizar cenários
cd scenarios/
python scenarios_checker_long_v1.py

# 2. Editar configuração
nano SC_scenario_extractor_long.py
# → Adicionar top 40 cenários

# 3. Configurar parâmetros de trading
nano run_ensemble_pipeline.py
# → Ajustar TP, SL, Ratchet SL

# 4. Executar pipeline
python run_ensemble_pipeline.py

# 5. Abrir Google Sheets e analisar!
```

---

**Última atualização:** 2025-12-11
**Versão:** 1.0
**Autor:** Quant Analysis Team
