#!/usr/bin/env python3
"""
Gera listagem de lançamentos a partir do controle de parcelamentos
(formato matriz cartão x mês → lista por data de vencimento / cartão).
"""

from __future__ import annotations

from calendar import monthrange
from datetime import date
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, NamedStyle, PatternFill, Side
from openpyxl.utils import get_column_letter

# Meses das colunas da planilha original (exceto totais)
MESES = [
    (2025, 12),
    (2026, 1),
    (2026, 2),
    (2026, 3),
    (2026, 4),
    (2026, 5),
    (2026, 6),
    (2026, 7),
    (2026, 8),
    (2026, 9),
    (2026, 10),
    (2026, 11),
    (2026, 12),
    (2027, 1),
    (2027, 2),
    (2027, 3),
    (2027, 4),
    (2027, 5),
]

MES_NOME = {
    1: "JANEIRO",
    2: "FEVEREIRO",
    3: "MARÇO",
    4: "ABRIL",
    5: "MAIO",
    6: "JUNHO",
    7: "JULHO",
    8: "AGOSTO",
    9: "SETEMBRO",
    10: "OUTUBRO",
    11: "NOVEMBRO",
    12: "DEZEMBRO",
}


def ym_range(y1: int, m1: int, y2: int, m2: int) -> list[tuple[int, int]]:
    out = []
    y, m = y1, m1
    while (y, m) <= (y2, m2):
        out.append((y, m))
        m += 1
        if m > 12:
            m = 1
            y += 1
    return out


def fill_months(
    start: tuple[int, int],
    end: tuple[int, int],
    valor: float,
) -> dict[tuple[int, int], float]:
    return {ym: valor for ym in ym_range(*start, *end)}


def fill_map(valores: dict[tuple[int, int], float]) -> dict[tuple[int, int], float]:
    return dict(valores)


# ---------------------------------------------------------------------------
# Dados extraídos da planilha CONTROLE - PARCELAMENTOS
# Formato: (cartão, dia_vencimento, descrição, { (ano, mês): valor })
# ---------------------------------------------------------------------------

ITENS: list[tuple[str, int | None, str, dict[tuple[int, int], float]]] = [
    # === CARTÃO SANTANDER (dia 10) ===
    (
        "CARTÃO SANTANDER",
        10,
        "POLTRONAS CASA",
        fill_months((2025, 12), (2026, 2), 100.00),
    ),
    (
        "CARTÃO SANTANDER",
        10,
        "SOFÁ KIKO",
        {
            **fill_months((2025, 12), (2026, 3), 153.04),
            (2026, 5): 153.04,
        },
    ),
    (
        "CARTÃO SANTANDER",
        10,
        "ENTRADA CELULAR RAPHAELA",
        {(2026, 1): 100.00},
    ),
    (
        "CARTÃO SANTANDER",
        10,
        "SERVIDOR - CONTABO",
        {
            (2026, 1): 333.53,
            (2026, 4): 331.41,
            (2026, 5): 527.00,
        },
    ),
    (
        "CARTÃO SANTANDER",
        10,
        "REPARO PNEU TCROSS - 20/01/2026",
        {(2026, 2): 130.00},
    ),
    (
        "CARTÃO SANTANDER",
        10,
        "REFORMA BANHEIRO",
        fill_months((2026, 7), (2026, 10), 401.26),
    ),
    # === CARTÃO CARREFOUR (dia 11) ===
    (
        "CARTÃO CARREFOUR",
        11,
        "QUADROS MERCADO LIVRE",
        {(2025, 12): 26.99, (2026, 1): 26.97},
    ),
    (
        "CARTÃO CARREFOUR",
        11,
        "CELULAR CONCEIÇÃO",
        {(2025, 12): 37.99, (2026, 1): 37.46},
    ),
    (
        "CARTÃO CARREFOUR",
        11,
        "SOFÁ CASA",
        fill_months((2025, 12), (2026, 3), 249.62),
    ),
    (
        "CARTÃO CARREFOUR",
        11,
        "CELULAR ANA CLARA",
        fill_months((2026, 1), (2027, 1), 99.57),
    ),
    (
        "CARTÃO CARREFOUR",
        11,
        "TROCA DE ÓLEO - 30/05/2026",
        fill_months((2026, 6), (2026, 7), 169.50),
    ),
    # === CARTÃO NUBANK (dia 12) ===
    (
        "CARTÃO NUBANK",
        12,
        "MATERIAL ESCOLAR - ANA CLARA & RAPHAELA",
        fill_months((2026, 2), (2026, 6), 348.25),
    ),
    (
        "CARTÃO NUBANK",
        12,
        "EMPRÉSTIMO REPOSIÇÃO COMPRAS SP - 06/03/2026",
        fill_months((2026, 4), (2026, 7), 567.50),
    ),
    (
        "CARTÃO NUBANK",
        12,
        "COMPRA MONJAURO - LEO/CARTÃO",
        fill_months((2026, 5), (2026, 8), 461.51),
    ),
    # === CARTÃO RENNER (dia 12) ===
    (
        "CARTÃO RENNER",
        12,
        "ROUPAS DAYANE",
        fill_months((2026, 2), (2026, 6), 63.50),
    ),
    (
        "CARTÃO RENNER",
        12,
        "CAMISETA FILIPE + ITEM RAPHAELA",
        {
            (2026, 4): 71.00,
            **fill_months((2026, 5), (2026, 8), 71.91),
        },
    ),
    # === CARTÃO PAGUE MENOS (dia 12) ===
    (
        "CARTÃO PAGUE MENOS",
        12,
        "COMPRA 18/02/2026",
        {
            (2026, 2): 327.00,
            (2026, 3): 327.17,
            (2026, 4): 327.17,
        },
    ),
    # === CARTÃO HAVAN (dia 15) ===
    (
        "CARTÃO HAVAN",
        15,
        "TAPETES",
        fill_months((2025, 12), (2026, 8), 99.90),
    ),
    (
        "CARTÃO HAVAN",
        15,
        "FERRO PASSAR ROUPA + COPOS + EDREDONS",
        fill_months((2026, 4), (2026, 8), 169.96),
    ),
    (
        "CARTÃO HAVAN",
        15,
        "AIR FRYER (26/07)",
        fill_months((2026, 9), (2026, 11), 246.67),
    ),
    # === CARTÃO ATACADÃO (dia 23) ===
    (
        "CARTÃO ATACADÃO",
        23,
        "APARELHO JANTAR - HAVAN",
        fill_months((2025, 12), (2026, 8), 39.90),
    ),
    (
        "CARTÃO ATACADÃO",
        23,
        "CELULAR RAPHAELA",
        fill_months((2026, 1), (2026, 10), 160.00),
    ),
    (
        "CARTÃO ATACADÃO",
        23,
        "TÊNIS RAPHAELA (BABY CALÇADOS)",
        {
            (2026, 5): 68.03,
            **fill_months((2026, 6), (2026, 9), 67.99),
        },
    ),
    # === EMPRÉSTIMOS (sem dia fixo de cartão — usa dia 1) ===
    (
        "EMPRÉSTIMOS",
        1,
        "PARCELAMENTO ESCOLA UNASP",
        fill_months((2026, 3), (2026, 12), 3100.00),
    ),
    (
        "EMPRÉSTIMOS",
        1,
        "SEGURO FIANÇA APTO - C.C. EIDI",
        {
            (2026, 4): 560.00,
            **fill_months((2026, 5), (2027, 2), 510.00),
        },
    ),
]


def safe_due_date(year: int, month: int, day: int | None) -> date:
    if day is None:
        day = 1
    last = monthrange(year, month)[1]
    return date(year, month, min(day, last))


def expand_lancamentos() -> list[dict]:
    rows: list[dict] = []
    for cartao, dia, descricao, valores in ITENS:
        for (ano, mes), valor in valores.items():
            if valor is None or abs(valor) < 0.0001:
                continue
            venc = safe_due_date(ano, mes, dia)
            rows.append(
                {
                    "data_vencimento": venc,
                    "dia": dia,
                    "mes_ref": f"{MES_NOME[mes]}/{ano}",
                    "ano": ano,
                    "mes": mes,
                    "cartao": cartao,
                    "descricao": descricao,
                    "valor": round(float(valor), 2),
                }
            )
    rows.sort(key=lambda r: (r["data_vencimento"], r["cartao"], r["descricao"]))
    return rows


def style_workbook(wb: Workbook, lancamentos: list[dict]) -> None:
    thin = Border(
        left=Side(style="thin", color="D0D0D0"),
        right=Side(style="thin", color="D0D0D0"),
        top=Side(style="thin", color="D0D0D0"),
        bottom=Side(style="thin", color="D0D0D0"),
    )
    header_fill = PatternFill("solid", fgColor="1F4E79")
    header_font = Font(bold=True, color="FFFFFF", name="Calibri", size=11)
    money_font = Font(name="Calibri", size=11)
    zebra = PatternFill("solid", fgColor="F2F2F2")
    card_fills = {
        "CARTÃO SANTANDER": PatternFill("solid", fgColor="E2EFDA"),
        "CARTÃO CARREFOUR": PatternFill("solid", fgColor="FFF2CC"),
        "CARTÃO NUBANK": PatternFill("solid", fgColor="E4DFEC"),
        "CARTÃO RENNER": PatternFill("solid", fgColor="FCE4D6"),
        "CARTÃO PAGUE MENOS": PatternFill("solid", fgColor="DDEBF7"),
        "CARTÃO HAVAN": PatternFill("solid", fgColor="F8CBAD"),
        "CARTÃO ATACADÃO": PatternFill("solid", fgColor="D9EAD3"),
        "CARTÃO SÃO VICENTE": PatternFill("solid", fgColor="CFE2F3"),
        "EMPRÉSTIMOS": PatternFill("solid", fgColor="F4CCCC"),
    }

    # --- Aba Lançamentos ---
    ws = wb.active
    ws.title = "Lançamentos"
    headers = [
        "Data Vencimento",
        "Dia",
        "Mês Referência",
        "Cartão",
        "Descrição",
        "Valor (R$)",
    ]
    ws.append(headers)
    for col, _ in enumerate(headers, 1):
        cell = ws.cell(1, col)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = thin

    for i, row in enumerate(lancamentos):
        ws.append(
            [
                row["data_vencimento"],
                row["dia"],
                row["mes_ref"],
                row["cartao"],
                row["descricao"],
                row["valor"],
            ]
        )
        r = i + 2
        for c in range(1, 7):
            cell = ws.cell(r, c)
            cell.border = thin
            cell.font = money_font
            if c == 1:
                cell.number_format = "DD/MM/YYYY"
                cell.alignment = Alignment(horizontal="center")
            elif c == 2:
                cell.alignment = Alignment(horizontal="center")
            elif c == 6:
                cell.number_format = "R$ #,##0.00"
                cell.alignment = Alignment(horizontal="right")
            fill = card_fills.get(row["cartao"])
            if fill and c == 4:
                cell.fill = fill
            elif i % 2 == 1 and c != 4:
                cell.fill = zebra

    widths = [16, 8, 18, 22, 48, 14]
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.auto_filter.ref = f"A1:F{len(lancamentos) + 1}"
    ws.freeze_panes = "A2"
    ws.row_dimensions[1].height = 22

    # --- Aba Resumo por Vencimento (dia da fatura no mês) ---
    ws2 = wb.create_sheet("Resumo por Vencimento")
    ws2.append(["Data Vencimento", "Cartão", "Qtd Lançamentos", "Total (R$)"])
    for col in range(1, 5):
        cell = ws2.cell(1, col)
        cell.fill = header_fill
        cell.font = header_font
        cell.border = thin
        cell.alignment = Alignment(horizontal="center")

    from collections import defaultdict

    grupos: dict[tuple[date, str], list[float]] = defaultdict(list)
    for row in lancamentos:
        grupos[(row["data_vencimento"], row["cartao"])].append(row["valor"])

    r = 2
    for (venc, cartao), vals in sorted(grupos.items()):
        ws2.append([venc, cartao, len(vals), round(sum(vals), 2)])
        ws2.cell(r, 1).number_format = "DD/MM/YYYY"
        ws2.cell(r, 4).number_format = "R$ #,##0.00"
        for c in range(1, 5):
            ws2.cell(r, c).border = thin
            if cartao in card_fills and c == 2:
                ws2.cell(r, c).fill = card_fills[cartao]
        r += 1

    for i, w in enumerate([16, 22, 16, 14], 1):
        ws2.column_dimensions[get_column_letter(i)].width = w
    ws2.auto_filter.ref = f"A1:D{r - 1}"
    ws2.freeze_panes = "A2"

    # --- Aba por Cartão ---
    ws3 = wb.create_sheet("Por Cartão")
    ws3.append(["Cartão", "Descrição", "Data Vencimento", "Mês Referência", "Valor (R$)"])
    for col in range(1, 6):
        cell = ws3.cell(1, col)
        cell.fill = header_fill
        cell.font = header_font
        cell.border = thin

    por_cartao = sorted(
        lancamentos, key=lambda x: (x["cartao"], x["data_vencimento"], x["descricao"])
    )
    for i, row in enumerate(por_cartao):
        ws3.append(
            [
                row["cartao"],
                row["descricao"],
                row["data_vencimento"],
                row["mes_ref"],
                row["valor"],
            ]
        )
        rr = i + 2
        ws3.cell(rr, 3).number_format = "DD/MM/YYYY"
        ws3.cell(rr, 5).number_format = "R$ #,##0.00"
        for c in range(1, 6):
            ws3.cell(rr, c).border = thin
        if row["cartao"] in card_fills:
            ws3.cell(rr, 1).fill = card_fills[row["cartao"]]

    for i, w in enumerate([22, 48, 16, 18, 14], 1):
        ws3.column_dimensions[get_column_letter(i)].width = w
    ws3.auto_filter.ref = f"A1:E{len(por_cartao) + 1}"
    ws3.freeze_panes = "A2"

    # --- Totais mensais ---
    ws4 = wb.create_sheet("Totais Mensais")
    ws4.append(["Mês Referência", "Ano", "Mês", "Total (R$)", "Qtd Lançamentos"])
    for col in range(1, 6):
        cell = ws4.cell(1, col)
        cell.fill = header_fill
        cell.font = header_font
        cell.border = thin

    mensal: dict[tuple[int, int], list[float]] = defaultdict(list)
    for row in lancamentos:
        mensal[(row["ano"], row["mes"])].append(row["valor"])

    r = 2
    for (ano, mes), vals in sorted(mensal.items()):
        ws4.append(
            [f"{MES_NOME[mes]}/{ano}", ano, mes, round(sum(vals), 2), len(vals)]
        )
        ws4.cell(r, 4).number_format = "R$ #,##0.00"
        for c in range(1, 6):
            ws4.cell(r, c).border = thin
        r += 1

    for i, w in enumerate([18, 8, 8, 14, 16], 1):
        ws4.column_dimensions[get_column_letter(i)].width = w


def main() -> None:
    out_dir = Path(__file__).resolve().parent
    artifacts = Path("/opt/cursor/artifacts")
    artifacts.mkdir(parents=True, exist_ok=True)

    lancamentos = expand_lancamentos()
    wb = Workbook()
    style_workbook(wb, lancamentos)

    out_name = "LISTAGEM - PARCELAMENTOS POR VENCIMENTO.xlsx"
    paths = [out_dir / out_name, artifacts / out_name]
    for p in paths:
        wb.save(p)
        print(f"Salvo: {p} ({len(lancamentos)} lançamentos)")

    total = sum(r["valor"] for r in lancamentos)
    print(f"Total geral: R$ {total:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
    print(f"Período: {lancamentos[0]['data_vencimento']} → {lancamentos[-1]['data_vencimento']}")


if __name__ == "__main__":
    main()
