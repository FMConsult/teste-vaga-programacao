# Listagem de Parcelamentos por Vencimento

Converte o controle financeiro em matriz (cartão × mês) para **listagem de lançamentos** ordenada por data de vencimento e cartão.

## Arquivos

| Arquivo | Descrição |
|---|---|
| `LISTAGEM - PARCELAMENTOS POR VENCIMENTO.xlsx` | Planilha gerada (pronta para uso) |
| `gerar_listagem.py` | Gera a listagem a partir dos dados lidos da captura da planilha original |
| `converter_planilha.py` | Converte automaticamente um `.xlsx` original no formato matriz |

## Abas da planilha gerada

1. **Lançamentos** — uma linha por parcela (Data Vencimento, Dia, Mês Ref., Cartão, Descrição, Valor), ordenada por vencimento → cartão
2. **Resumo por Vencimento** — total por data de fatura + cartão
3. **Por Cartão** — mesma listagem agrupada por cartão
4. **Totais Mensais** — consolidado por mês de referência

## Como regenerar a partir do arquivo original

```bash
pip install openpyxl
python3 converter_planilha.py "/caminho/CONTROLE - PARCELAMENTOS.xlsx"
```

## Observação

A listagem atual foi montada a partir da captura da planilha. Itens pouco legíveis na imagem (ex.: compras São Vicente, empréstimos C.C. Kiko, taxas Pague Menos e meses intermediários do Contabo) podem estar incompletos. Para versão 100% fiel, rode o `converter_planilha.py` no `.xlsx` original.
