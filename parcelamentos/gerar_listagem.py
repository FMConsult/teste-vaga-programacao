#!/usr/bin/env python3
"""Gera listagem de lançamentos a partir do CSV colado da planilha original."""

from __future__ import annotations

from calendar import monthrange
from collections import defaultdict
from datetime import date
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

# Índices das colunas de mês no CSV (após split por ';')
# 0=nome, 1=dia, 2..=meses, 15=TOTAL 2026, 16..=2027, 21=TOTAL 2027
MONTH_COLS = [
    (2, 2025, 12),
    (3, 2026, 1),
    (4, 2026, 2),
    (5, 2026, 3),
    (6, 2026, 4),
    (7, 2026, 5),
    (8, 2026, 6),
    (9, 2026, 7),
    (10, 2026, 8),
    (11, 2026, 9),
    (12, 2026, 10),
    (13, 2026, 11),
    (14, 2026, 12),
    (16, 2027, 1),
    (17, 2027, 2),
    (18, 2027, 3),
    (19, 2027, 4),
    (20, 2027, 5),
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

CSV_DATA = r"""
CARTAO SANTANDER;10;R$ 3.981,86;R$ 3.510,39;R$ 3.206,84;R$ 1.410,18;R$ 4.560,94;R$ 2.794,14;R$ 1.110,00;R$ 3.500,52;R$ 3.331,88;R$ 1.707,38;R$ 597,38;R$ 401,26;R$ 0,00;R$ 26.130,91;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00
POLTRONAS CASA;;R$ 100,00;R$ 100,00;R$ 100,00;R$ 100,00;;;;;;;;;;R$ 300,00;;;;;;R$ 0,00
SOFA KIKO;;R$ 153,04;R$ 153,04;R$ 153,04;R$ 153,04;R$ 153,04;;;;;;;;;R$ 612,16;;;;;;R$ 0,00
ENTRADA CELULAR RAPHAELA;;;R$ 100,00;;;;;;;;;;;;R$ 100,00;;;;;;R$ 0,00
SERVIDOR – CONTABO;;;R$ 333,53;;;R$ 331,41;R$ 527,00;;;;;;;;R$ 1.191,94;;;;;;R$ 0,00
REPARO PNEU TCROSS - 20/01/2026;;;;R$ 130,00;;;;;;;;;;;R$ 130,00;;;;;;R$ 0,00
TRELICHE - MADEIRA MADEIRA;;;;;;;;;R$ 401,26;R$ 401,26;R$ 401,26;R$ 401,26;R$ 401,26;;R$ 2.006,30;;;;;;R$ 0,00
MESINHA ESCRITORIO FILIPE;;;;;;;;;R$ 168,64;;;;;;R$ 168,64;;;;;;R$ 0,00
EMPREST. C.C. KIKO;;R$ 905,00;;;;R$ 1.000,00;;;;;;;;;R$ 1.000,00;;;;;;R$ 0,00
PARC. MEI CNPJ CEU DE FESTA 1;;;;;;;;;R$ 167,26;R$ 167,26;R$ 167,26;R$ 167,26;;;R$ 669,04;;;;;;R$ 0,00
PARC. MEI CNPJ CEU DE FESTA 2;;;;;;;;;R$ 28,86;R$ 28,86;R$ 28,86;R$ 28,86;;;R$ 115,44;;;;;;R$ 0,00
EMPREST. C.C. KIKO;;R$ 1.157,16;R$ 1.157,14;R$ 1.157,14;R$ 1.157,14;R$ 1.157,14;R$ 1.157,14;;;;;;;;R$ 5.785,70;;;;;;R$ 0,00
EMPREST. C.C. KIKO – FINANC. CARRO;;;;;;R$ 1.919,35;;;;;;;;;R$ 1.919,35;;;;;;R$ 0,00
EMPREST. C.C. KIKO;;R$ 1.666,66;R$ 1.666,68;R$ 1.666,66;;;;;R$ 1.624,50;R$ 1.624,50;;;;;R$ 6.582,34;;;;;;R$ 0,00
EMPREST. C.C. KIKO;;;;;;;R$ 1.110,00;R$ 1.110,00;R$ 1.110,00;R$ 1.110,00;R$ 1.110,00;;;;R$ 5.550,00;;;;;;R$ 0,00
CARTAO CARREFOUR;11;R$ 415,80;R$ 445,62;R$ 474,19;R$ 425,47;R$ 279,32;R$ 204,07;R$ 269,07;R$ 269,07;R$ 99,57;R$ 99,57;R$ 99,57;R$ 99,57;R$ 99,57;R$ 2.864,66;R$ 99,57;R$ 99,57;R$ 99,57;R$ 0,00;R$ 0,00;R$ 298,71
EMPREST. C.C. KIKO;;R$ 32,00;R$ 32,00;R$ 32,00;R$ 32,00;R$ 31,96;;;;;;;;;R$ 127,96;;;;;;R$ 0,00
QUADROS MERCADO LIVRE;;R$ 26,99;R$ 26,97;;;;;;;;;;;;R$ 26,97;;;;;;R$ 0,00
FANTASIA RAPHA MKM;;R$ 69,20;;;;;;;;;;;;;R$ 0,00;;;;;;R$ 0,00
CELULAR CONCEICAO;;R$ 37,99;R$ 37,46;;;;;;;;;;;;R$ 37,46;;;;;;R$ 0,00
SOFA CASA;;R$ 249,62;R$ 249,62;R$ 249,62;R$ 249,62;;;;;;;;;;R$ 748,86;;;;;;R$ 0,00
POTES MARMITA MAR. LAR;;;;R$ 43,00;R$ 43,00;R$ 43,29;;;;;;;;;R$ 129,29;;;;;;R$ 0,00
COMBUSTIVEL CARRO - 19/01/2026;;;;R$ 50,00;R$ 1,28;;;;;;;;;;R$ 51,28;;;;;;R$ 0,00
CELULAR ANA CLARA;;;R$ 99,57;R$ 99,57;R$ 99,57;R$ 99,57;R$ 99,57;R$ 99,57;R$ 99,57;R$ 99,57;R$ 99,57;R$ 99,57;R$ 99,57;R$ 99,57;R$ 1.194,84;R$ 99,57;R$ 99,57;R$ 99,57;;;R$ 298,71
PANELA DE ARROZ;;;;;;R$ 104,50;R$ 104,50;;;;;;;;R$ 209,00;;;;;;R$ 0,00
TROCA DE OLEO - 30/05/2026;;;;;;;;R$ 169,50;R$ 169,50;;;;;;R$ 339,00;;;;;;R$ 0,00
CARTAO NUBANK;12;R$ 0,00;R$ 0,00;R$ 348,25;R$ 1.338,85;R$ 2.403,83;R$ 2.014,13;R$ 1.377,26;R$ 1.032,01;R$ 56,67;R$ 56,67;R$ 56,67;R$ 0,00;R$ 0,00;R$ 8.514,33;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00
MATERIAL ESCOLAR - ANA CLARA & RAPHAELA;;;;R$ 348,25;R$ 348,25;R$ 348,25;R$ 348,25;R$ 348,25;;;;;;;R$ 1.741,25;;;;;;R$ 0,00
SERVIDOR – CONTABO;;;;;R$ 484,03;;;;;;;;;;R$ 484,03;;;;;;R$ 0,00
COMBUSTÍVEL 05-03;;;;;;R$ 180,00;;;;;;;;;R$ 180,00;;;;;;R$ 0,00
EMPRESTIMO COMPRAS SEMIJOIAS - 18/02/2026;;;;;R$ 436,67;R$ 436,67;R$ 436,66;;;;;;;;R$ 1.310,00;;;;;;R$ 0,00
EMPRESTIMO REPOSICAO COMPRAS SP - 06/03/2026;;;;;;R$ 567,50;R$ 567,50;R$ 567,50;R$ 567,50;;;;;;R$ 2.270,00;;;;;;R$ 0,00
COMBUSTIVEL - SP - 05/03/2026;;;;;;R$ 250,00;;;;;;;;;R$ 250,00;;;;;;R$ 0,00
COMPRAS SEMIJOIAS - ROCHELI BIJOU;;;;;;R$ 150,00;R$ 150,34;;;;;;;;R$ 300,34;;;;;;R$ 0,00
COMPRA MONJAURO - LEO/CARTAO;;;;;;R$ 461,51;R$ 461,51;R$ 461,51;R$ 461,51;;;;;;R$ 1.846,04;;;;;;R$ 0,00
MERCADO LIVRE = MELI+;;;;;R$ 9,90;R$ 9,90;;;;;;;;;R$ 19,80;;;;;;R$ 0,00
COMPRA TIK TOK SHOP (05/04);;;;;;;R$ 19,17;;;;;;;;R$ 19,17;;;;;;R$ 0,00
COMPRA TIK TOK SHOP (27/07);;;;;;;;;;R$ 56,67;R$ 56,67;R$ 56,67;;;;;;;;;
COMPRA TIK TOK SHOP (27/04);;;;;;;R$ 30,70;;;;;;;;R$ 30,70;;;;;;R$ 0,00
MICROSOFT - OFFICE 365;;;;;R$ 60,00;;;;R$ 3,00;;;;;;R$ 63,00;;;;;;R$ 0,00
CARTAO RENNER;12;R$ 0,00;R$ 0,00;R$ 63,50;R$ 63,50;R$ 63,50;R$ 134,50;R$ 135,41;R$ 71,91;R$ 71,91;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 604,23;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00
ROUPAS DAYANE;;;;R$ 63,50;R$ 63,50;R$ 63,50;R$ 63,50;R$ 63,50;;;;;;;R$ 317,50;;;;;;R$ 0,00
CAMISETA FILIPE + ITEM RAPHAELA;;;;;;;R$ 71,00;R$ 71,91;R$ 71,91;R$ 71,91;;;;;R$ 286,73;;;;;;R$ 0,00
CARTAO PAGUE MENOS;12;R$ 0,00;R$ 0,00;R$ 327,00;R$ 585,19;R$ 585,19;R$ 318,02;R$ 526,60;R$ 497,19;R$ 726,32;R$ 305,44;R$ 305,43;R$ 0,00;R$ 0,00;R$ 4.176,38;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00
COMPRA (SEM DESCRIÇÃO);;;;R$ 327,00;R$ 327,17;R$ 327,17;;;;;;;;;R$ 981,34;;;;;;R$ 0,00
TAXA CARTAO;;;;;;;R$ 9,99;R$ 9,99;R$ 9,99;R$ 9,99;;;;;R$ 39,96;;;;;;R$ 0,00
TAXA OVERLIMIT;;;;;;;;R$ 9,99;;;;;;;R$ 9,99;;;;;;R$ 0,00
TAXA ATRASO;;;;;;;;R$ 2,99;;;;;;;R$ 2,99;;;;;;R$ 0,00
ENCARGO ATRASO;;;;;;;;R$ 9,54;;;;;;;R$ 9,54;;;;;;R$ 0,00
JUROS + MORA;;;;;;;;R$ 6,89;;;;;;;R$ 6,89;;;;;;R$ 0,00
COMPRA 18/02/2026;;;;;R$ 161,65;R$ 161,65;;;;;;;;;R$ 323,30;;;;;;R$ 0,00
COMPRA 21/02/2026;;;;;R$ 96,37;R$ 96,37;;;;;;;;;R$ 192,74;;;;;;R$ 0,00
COMPRA 04/04/2026;;;;;;;R$ 76,31;R$ 76,31;R$ 76,31;;;;;;R$ 228,93;;;;;;R$ 0,00
COMPRA 05/04/2026;;;;;;;R$ 231,72;;;;;;;;R$ 231,72;;;;;;R$ 0,00
COMPRA 24/05/2026;;;;;;;;R$ 410,89;R$ 410,89;R$ 410,89;;;;;R$ 1.232,67;;;;;;R$ 0,00
COMPRA 27/07/2026;;;;;;;;;;R$ 305,44;R$ 305,44;R$ 305,43;;;R$ 916,31;;;;;;R$ 0,00
CARTAO HAVAN;15;R$ 114,90;R$ 114,90;R$ 114,90;R$ 114,90;R$ 269,86;R$ 398,43;R$ 398,43;R$ 398,43;R$ 645,10;R$ 375,24;R$ 246,67;R$ 0,00;R$ 0,00;R$ 3.076,85;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00
TAPETES;;R$ 99,90;R$ 99,90;R$ 99,90;R$ 99,90;R$ 99,90;R$ 99,90;R$ 99,90;R$ 99,90;R$ 99,90;;;;;R$ 799,20;;;;;;R$ 0,00
ITENS CASA;;R$ 15,00;R$ 15,00;R$ 15,00;R$ 15,00;;;;;;;;;;R$ 45,00;;;;;;R$ 0,00
FERRO PASSAR ROUPA + COPOS + EDREDONS;;;;;;R$ 169,96;R$ 169,96;R$ 169,96;R$ 169,96;R$ 169,96;;;;;R$ 849,80;;;;;;R$ 0,00
AIR FRYER (26/07);;;;;;;;;;R$ 246,67;R$ 246,67;R$ 246,67;;;R$ 740,00;;;;;;R$ 0,00
COMPRA TAPETE + COISAS CASA (02/05);;;;;;;R$ 128,57;R$ 128,57;R$ 128,57;R$ 128,57;R$ 128,57;;;;R$ 642,85;;;;;;R$ 0,00
CARTAO ATACADAO;23;R$ 516,81;R$ 527,84;R$ 1.176,79;R$ 864,90;R$ 3.199,90;R$ 636,27;R$ 636,23;R$ 636,23;R$ 267,89;R$ 227,99;R$ 160,00;R$ 0,00;R$ 0,00;R$ 8.334,04;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00
APARELHO JANTAR – HAVAN;;R$ 39,90;R$ 39,90;R$ 39,90;R$ 39,90;R$ 39,90;R$ 39,90;R$ 39,90;R$ 39,90;R$ 39,90;;;;;R$ 319,20;;;;;;R$ 0,00
COMPRA ATACADAO;;R$ 428,45;;;;;;;;;;;;;R$ 0,00;;;;;;R$ 0,00
COMPRA HALLOWEEN;;R$ 48,46;;;;;;;;;;;;;R$ 0,00;;;;;;R$ 0,00
CELULAR RAPHAELA;;;R$ 160,00;R$ 160,00;R$ 160,00;R$ 160,00;R$ 160,00;R$ 160,00;R$ 160,00;R$ 160,00;R$ 160,00;R$ 160,00;;;R$ 1.600,00;;;;;;R$ 0,00
SERVIDOR – CONTABO;;;R$ 327,94;R$ 311,89;;;;;;;;;;;R$ 639,83;;;;;;R$ 0,00
TENIS RAPHAELA (BABY CALCADOS);;;;;;;R$ 68,03;R$ 67,99;R$ 67,99;R$ 67,99;R$ 67,99;;;;R$ 339,99;;;;;;R$ 0,00
EMPREST. C.C. KIKO;;;;R$ 665,00;R$ 665,00;R$ 3.000,00;R$ 368,34;R$ 368,34;R$ 368,34;;;;;;R$ 5.435,02;;;;;;R$ 0,00
CARTAO SÃO VICENTE;25;R$ 0,00;R$ 0,00;R$ 0,00;R$ 355,00;R$ 595,00;R$ 937,00;R$ 0,00;R$ 200,00;R$ 280,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 2.367,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 0,00
COMPRA SUP. - 07/03/2026;;;;;R$ 355,00;R$ 355,00;R$ 355,00;;R$ 200,00;;;;;;R$ 1.265,00;;;;;;R$ 0,00
COMPRA SUP. – N/D;;;;;;;R$ 350,00;;;;;;;;R$ 350,00;;;;;;R$ 0,00
COMPRA SUP. – N/D;;;;;;;R$ 185,00;;;;;;;;R$ 185,00;;;;;;R$ 0,00
COMPRA SUP. – N/D;;;;;;;;;;R$ 280,00;;;;;R$ 280,00;;;;;;R$ 0,00
COMPRA SUP. – N/D;;;;;;R$ 240,00;R$ 47,00;;;;;;;;R$ 287,00;;;;;;R$ 0,00
EMPRESTIMOS;;R$ 0,00;R$ 0,00;R$ 0,00;R$ 3.100,00;R$ 7.100,00;R$ 5.660,00;R$ 5.660,00;R$ 5.660,00;R$ 3.610,00;R$ 3.610,00;R$ 3.610,00;R$ 3.610,00;R$ 3.610,00;R$ 45.230,00;R$ 510,00;R$ 510,00;R$ 0,00;R$ 0,00;R$ 0,00;R$ 1.020,00
PARCELAMENTO ESCOLA UNASP - C.C. EIDI - 01/02;;;;;R$ 3.100,00;R$ 3.100,00;R$ 3.100,00;R$ 3.100,00;R$ 3.100,00;R$ 3.100,00;R$ 3.100,00;R$ 3.100,00;R$ 3.100,00;R$ 3.100,00;R$ 31.000,00;;;;;;R$ 0,00
EMPRESTIMO C/ MAURICIO FAGGION - 02/2026;;;;;;R$ 4.000,00;R$ 2.000,00;R$ 2.000,00;R$ 2.000,00;;;;;;R$ 10.000,00;;;;;;R$ 0,00
SEGURO FIANÇA APTO - C.C. EIDI;;;;;;;R$ 560,00;R$ 560,00;R$ 560,00;R$ 510,00;R$ 510,00;R$ 510,00;R$ 510,00;R$ 510,00;R$ 4.230,00;R$ 510,00;R$ 510,00;;;;R$ 1.020,00
""".strip()


def parse_money(text: str) -> float | None:
    text = (text or "").strip()
    if not text or text == "-":
        return None
    text = text.replace("R$", "").replace(" ", "").strip()
    if not text:
        return None
    text = text.replace(".", "").replace(",", ".")
    try:
        return float(text)
    except ValueError:
        return None


def normalize_card(name: str) -> str:
    u = " ".join(name.strip().upper().split())
    u = (
        u.replace("CARTAO", "CARTÃO")
        .replace("ATACADAO", "ATACADÃO")
        .replace("EMPRESTIMOS", "EMPRÉSTIMOS")
        .replace("SAO VICENTE", "SÃO VICENTE")
    )
    return u


def is_card_header(name: str) -> bool:
    u = name.strip().upper()
    return u.startswith("CARTAO") or u.startswith("CARTÃO") or u.startswith("EMPRESTIMOS") or u.startswith("EMPRÉSTIMOS")


def safe_due(year: int, month: int, day: int | None) -> date:
    d = 1 if day is None else int(day)
    return date(year, month, min(d, monthrange(year, month)[1]))


def expand() -> list[dict]:
    rows: list[dict] = []
    current_card = None
    current_dia: int | None = None
    kiko_seq: dict[str, int] = defaultdict(int)
    nd_seq = 0

    for line in CSV_DATA.splitlines():
        parts = line.split(";")
        # garantir tamanho
        while len(parts) < 22:
            parts.append("")
        name = parts[0].strip()
        if not name:
            continue

        if is_card_header(name):
            current_card = normalize_card(name)
            dia_raw = parts[1].strip()
            current_dia = int(float(dia_raw)) if dia_raw else None
            if current_card == "EMPRÉSTIMOS":
                current_dia = 1  # sem dia de fatura; usa dia 1 como referência
            continue

        if current_card is None:
            continue

        desc = name
        # Desambiguar linhas repetidas EMPREST. C.C. KIKO / COMPRA SUP. N/D
        if desc.upper().startswith("EMPREST. C.C. KIKO") and "FINANC" not in desc.upper():
            kiko_seq[current_card] += 1
            desc = f"{desc} #{kiko_seq[current_card]}"
        elif "COMPRA SUP" in desc.upper() and "N/D" in desc.upper():
            nd_seq += 1
            desc = f"COMPRA SUP. – N/D #{nd_seq}"

        for col, year, month in MONTH_COLS:
            valor = parse_money(parts[col] if col < len(parts) else "")
            if valor is None or abs(valor) < 0.0001:
                continue
            rows.append(
                {
                    "data_vencimento": safe_due(year, month, current_dia),
                    "dia": current_dia,
                    "mes_ref": f"{MES_NOME[month]}/{year}",
                    "ano": year,
                    "mes": month,
                    "cartao": current_card,
                    "descricao": desc,
                    "valor": round(valor, 2),
                }
            )

    rows.sort(key=lambda r: (r["data_vencimento"], r["cartao"], r["descricao"]))
    return rows


def write_xlsx(lancamentos: list[dict], paths: list[Path]) -> None:
    thin = Border(
        left=Side(style="thin", color="D0D0D0"),
        right=Side(style="thin", color="D0D0D0"),
        top=Side(style="thin", color="D0D0D0"),
        bottom=Side(style="thin", color="D0D0D0"),
    )
    header_fill = PatternFill("solid", fgColor="1F4E79")
    header_font = Font(bold=True, color="FFFFFF", name="Calibri", size=11)
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

    wb = Workbook()

    # --- Lançamentos ---
    ws = wb.active
    ws.title = "Lançamentos"
    headers = ["Data Vencimento", "Dia", "Mês Referência", "Cartão", "Descrição", "Valor (R$)"]
    ws.append(headers)
    for col in range(1, 7):
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
            if c == 4 and row["cartao"] in card_fills:
                cell.fill = card_fills[row["cartao"]]
            elif i % 2 == 1:
                cell.fill = zebra
        ws.cell(r, 1).number_format = "DD/MM/YYYY"
        ws.cell(r, 1).alignment = Alignment(horizontal="center")
        ws.cell(r, 2).alignment = Alignment(horizontal="center")
        ws.cell(r, 6).number_format = 'R$ #,##0.00'

    for i, w in enumerate([16, 8, 18, 22, 52, 14], 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.auto_filter.ref = f"A1:F{len(lancamentos) + 1}"
    ws.freeze_panes = "A2"
    ws.row_dimensions[1].height = 22

    # --- Resumo por Vencimento ---
    ws2 = wb.create_sheet("Resumo por Vencimento")
    ws2.append(["Data Vencimento", "Cartão", "Qtd Lançamentos", "Total (R$)"])
    for col in range(1, 5):
        cell = ws2.cell(1, col)
        cell.fill = header_fill
        cell.font = header_font
        cell.border = thin
        cell.alignment = Alignment(horizontal="center")

    grupos: dict[tuple, list[float]] = defaultdict(list)
    for row in lancamentos:
        grupos[(row["data_vencimento"], row["cartao"])].append(row["valor"])

    r = 2
    for (venc, cartao), vals in sorted(grupos.items()):
        ws2.append([venc, cartao, len(vals), round(sum(vals), 2)])
        ws2.cell(r, 1).number_format = "DD/MM/YYYY"
        ws2.cell(r, 4).number_format = 'R$ #,##0.00'
        for c in range(1, 5):
            ws2.cell(r, c).border = thin
            if c == 2 and cartao in card_fills:
                ws2.cell(r, c).fill = card_fills[cartao]
        r += 1
    for i, w in enumerate([16, 22, 16, 14], 1):
        ws2.column_dimensions[get_column_letter(i)].width = w
    ws2.auto_filter.ref = f"A1:D{r - 1}"
    ws2.freeze_panes = "A2"

    # --- Por Cartão ---
    ws3 = wb.create_sheet("Por Cartão")
    ws3.append(["Cartão", "Descrição", "Data Vencimento", "Mês Referência", "Valor (R$)"])
    for col in range(1, 6):
        cell = ws3.cell(1, col)
        cell.fill = header_fill
        cell.font = header_font
        cell.border = thin

    ordered = sorted(lancamentos, key=lambda x: (x["cartao"], x["data_vencimento"], x["descricao"]))
    for i, row in enumerate(ordered):
        ws3.append([row["cartao"], row["descricao"], row["data_vencimento"], row["mes_ref"], row["valor"]])
        rr = i + 2
        ws3.cell(rr, 3).number_format = "DD/MM/YYYY"
        ws3.cell(rr, 5).number_format = 'R$ #,##0.00'
        for c in range(1, 6):
            ws3.cell(rr, c).border = thin
        if row["cartao"] in card_fills:
            ws3.cell(rr, 1).fill = card_fills[row["cartao"]]
    for i, w in enumerate([22, 52, 16, 18, 14], 1):
        ws3.column_dimensions[get_column_letter(i)].width = w
    ws3.auto_filter.ref = f"A1:E{len(ordered) + 1}"
    ws3.freeze_panes = "A2"

    # --- Totais Mensais ---
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
        ws4.append([f"{MES_NOME[mes]}/{ano}", ano, mes, round(sum(vals), 2), len(vals)])
        ws4.cell(r, 4).number_format = 'R$ #,##0.00'
        for c in range(1, 6):
            ws4.cell(r, c).border = thin
        r += 1
    for i, w in enumerate([18, 8, 8, 14, 16], 1):
        ws4.column_dimensions[get_column_letter(i)].width = w

    # --- Totais por Cartão ---
    ws5 = wb.create_sheet("Totais por Cartão")
    ws5.append(["Cartão", "Qtd Lançamentos", "Total (R$)"])
    for col in range(1, 4):
        cell = ws5.cell(1, col)
        cell.fill = header_fill
        cell.font = header_font
        cell.border = thin
    por_cartao: dict[str, list[float]] = defaultdict(list)
    for row in lancamentos:
        por_cartao[row["cartao"]].append(row["valor"])
    r = 2
    for cartao, vals in sorted(por_cartao.items(), key=lambda x: -sum(x[1])):
        ws5.append([cartao, len(vals), round(sum(vals), 2)])
        ws5.cell(r, 3).number_format = 'R$ #,##0.00'
        for c in range(1, 4):
            ws5.cell(r, c).border = thin
        if cartao in card_fills:
            ws5.cell(r, 1).fill = card_fills[cartao]
        r += 1
    for i, w in enumerate([22, 16, 14], 1):
        ws5.column_dimensions[get_column_letter(i)].width = w

    for p in paths:
        p.parent.mkdir(parents=True, exist_ok=True)
        wb.save(p)
        print(f"Salvo: {p}")


def validate(lancamentos: list[dict]) -> None:
    """Confere totais mensais gerais da planilha original."""
    expected_monthly = {
        (2025, 12): 5029.37,
        (2026, 1): 4598.75,
        (2026, 2): 5711.47,
        (2026, 3): 5157.99,
        (2026, 4): 11957.54,
        (2026, 5): 7436.56,
        (2026, 6): 4453.00,
        (2026, 7): 6605.36,
        (2026, 8): 5479.33,
        (2026, 9): 2772.28,
        (2026, 10): 1465.71,
        (2026, 11): 500.83,
        (2026, 12): 99.57,  # note: total mensal row shows 99.57 for Dec 2026 but also has emprestimos
    }
    # O TOTAL MENSAL da planilha original parece incluir só cartões em alguns meses?
    # Vamos conferir por cartão os subtotais das linhas-cabeçalho.

    card_expected = {
        ("CARTÃO SANTANDER", 2025, 12): 3981.86,
        ("CARTÃO SANTANDER", 2026, 1): 3510.39,
        ("CARTÃO CARREFOUR", 2025, 12): 415.80,
        ("CARTÃO NUBANK", 2026, 2): 348.25,
        ("EMPRÉSTIMOS", 2026, 3): 3100.00,
        ("EMPRÉSTIMOS", 2026, 4): 7100.00,
        ("EMPRÉSTIMOS", 2027, 1): 510.00,
    }

    got: dict[tuple, float] = defaultdict(float)
    for row in lancamentos:
        got[(row["cartao"], row["ano"], row["mes"])] += row["valor"]

    print("\nValidação vs subtotais da planilha:")
    ok = True
    for key, exp in card_expected.items():
        g = round(got[key], 2)
        match = abs(g - exp) < 0.02
        status = "OK" if match else "DIFF"
        if not match:
            ok = False
        print(f"  {status} {key}: esperado {exp:.2f} | obtido {g:.2f}")

    # Validar todos os cabeçalhos de cartão mês a mês
    header_totals = {
        "CARTÃO SANTANDER": [
            3981.86, 3510.39, 3206.84, 1410.18, 4560.94, 2794.14, 1110.00,
            3500.52, 3331.88, 1707.38, 597.38, 401.26, 0.00, 0, 0, 0, 0, 0,
        ],
        "CARTÃO CARREFOUR": [
            415.80, 445.62, 474.19, 425.47, 279.32, 204.07, 269.07, 269.07,
            99.57, 99.57, 99.57, 99.57, 99.57, 99.57, 99.57, 99.57, 0, 0,
        ],
        "CARTÃO NUBANK": [
            0, 0, 348.25, 1338.85, 2403.83, 2014.13, 1377.26, 1032.01,
            56.67, 56.67, 56.67, 0, 0, 0, 0, 0, 0, 0,
        ],
        "CARTÃO RENNER": [
            0, 0, 63.50, 63.50, 63.50, 134.50, 135.41, 71.91, 71.91, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        "CARTÃO PAGUE MENOS": [
            0, 0, 327.00, 585.19, 585.19, 318.02, 526.60, 497.19, 726.32,
            305.44, 305.43, 0, 0, 0, 0, 0, 0, 0,
        ],
        "CARTÃO HAVAN": [
            114.90, 114.90, 114.90, 114.90, 269.86, 398.43, 398.43, 398.43,
            645.10, 375.24, 246.67, 0, 0, 0, 0, 0, 0, 0,
        ],
        "CARTÃO ATACADÃO": [
            516.81, 527.84, 1176.79, 864.90, 3199.90, 636.27, 636.23, 636.23,
            267.89, 227.99, 160.00, 0, 0, 0, 0, 0, 0, 0,
        ],
        "CARTÃO SÃO VICENTE": [
            0, 0, 0, 355.00, 595.00, 937.00, 0, 200.00, 280.00, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        "EMPRÉSTIMOS": [
            0, 0, 0, 3100.00, 7100.00, 5660.00, 5660.00, 5660.00, 3610.00,
            3610.00, 3610.00, 3610.00, 3610.00, 510.00, 510.00, 0, 0, 0,
        ],
    }
    months = [(y, m) for _, y, m in MONTH_COLS]
    print("\nConferência completa por cartão/mês:")
    for card, expected_list in header_totals.items():
        for i, (year, month) in enumerate(months):
            exp = expected_list[i]
            g = round(got[(card, year, month)], 2)
            if abs(g - exp) >= 0.02:
                ok = False
                print(f"  DIFF {card} {MES_NOME[month]}/{year}: esperado {exp:.2f} | obtido {g:.2f} | delta {g-exp:.2f}")
    if ok:
        print("  Todas as conferências OK.")


def main() -> None:
    lancamentos = expand()
    total = sum(r["valor"] for r in lancamentos)
    print(f"Lançamentos: {len(lancamentos)}")
    print(f"Total geral: R$ {total:,.2f}")
    print(f"Período: {lancamentos[0]['data_vencimento']} → {lancamentos[-1]['data_vencimento']}")

    validate(lancamentos)

    out_name = "LISTAGEM - PARCELAMENTOS POR VENCIMENTO.xlsx"
    paths = [
        Path("/workspace/parcelamentos") / out_name,
        Path("/opt/cursor/artifacts") / out_name,
    ]
    write_xlsx(lancamentos, paths)


if __name__ == "__main__":
    main()
