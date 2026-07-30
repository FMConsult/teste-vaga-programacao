# Listagem de Parcelamentos por Vencimento

Converte o controle financeiro em matriz (cartão × mês) para **listagem de lançamentos** ordenada por data de vencimento e cartão.

## Arquivo gerado

`LISTAGEM - PARCELAMENTOS POR VENCIMENTO.xlsx`

| Aba | Conteúdo |
|---|---|
| **Lançamentos** | Uma linha por parcela, ordenada por vencimento → cartão → descrição |
| **Resumo por Vencimento** | Total por data de fatura + cartão |
| **Por Cartão** | Mesma listagem agrupada por cartão |
| **Totais Mensais** | Consolidado por mês de referência |
| **Totais por Cartão** | Soma geral por cartão/empréstimo |

Colunas: Data Vencimento | Dia | Mês Referência | Cartão | Descrição | Valor (R$)

## Resultado atual

- **242 lançamentos**
- Período: **10/12/2025 → 11/03/2027**
- Total geral: **R$ 107.816,50**
- Totais por cartão/mês conferidos com a planilha original (100% OK)

## Como regenerar

```bash
pip install -r requirements.txt
python3 gerar_listagem.py
```

Ou, a partir do `.xlsx` original em formato matriz:

```bash
python3 converter_planilha.py "/caminho/CONTROLE - PARCELAMENTOS.xlsx"
```

## Observações

- A data de vencimento usa o **dia da fatura do cartão** (coluna DIA) + mês/ano da coluna.
- Empréstimos sem dia de fatura usam dia **1** como referência.
- Linhas repetidas `EMPREST. C.C. KIKO` e `COMPRA SUP. – N/D` foram numeradas (`#1`, `#2`…) para diferenciar.
- A linha sem nome no Pague Menos foi rotulada como `COMPRA (SEM DESCRIÇÃO)`.
