#!/usr/bin/env python3
"""
Converte a planilha matriz CONTROLE - PARCELAMENTOS.xlsx
em listagem de lançamentos por data de vencimento / cartão.

Uso:
  python3 converter_planilha.py "/caminho/CONTROLE - PARCELAMENTOS.xlsx"
"""

from __future__ import annotations

import re
import sys
from calendar import monthrange
from collections import defaultdict
from datetime import date
from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

MES_MAP = {
    "JANEIRO": 1,
    "FEVEREIRO": 2,
    "MARÇO": 3,
    "MARCO": 3,
    "ABRIL": 4,
    "MAIO": 5,
    "JUNHO": 6,
    "JULHO": 7,
    "AGOSTO": 8,
    "SETEMBRO": 9,
    "OUTUBRO": 10,
    "NOVEMBRO": 11,
    "DEZEMBRO": 12,
}

MES_NOME = {v: k for k, v in MES_MAP.items() if k != "MARCO"}


def parse_month_header(value) -> tuple[int, int] | None:
    if value is None:
        return None
    text = str(value).strip().upper()
    if "TOTAL" in text:
        return None
    # Ex.: "DEZEMBRO\n2025" ou "DEZEMBRO 2025"
    text = text.replace("\n", " ")
    m = re.search(
        r"(JANEIRO|FEVEREIRO|MAR[CÇ]O|ABRIL|MAIO|JUNHO|JULHO|AGOSTO|SETEMBRO|OUTUBRO|NOVEMBRO|DEZEMBRO)\s*(\d{4})",
        text,
    )
    if not m:
        return None
    mes_nome = m.group(1).replace("Ç", "C")
    if mes_nome == "MARCO":
        mes = 3
    else:
        mes = MES_MAP.get(mes_nome)
    if not mes:
        return None
    return int(m.group(2)), mes


def is_card_header(name: str, dia) -> bool:
    if not name:
        return False
    u = name.strip().upper()
    if u.startswith("CARTAO") or u.startswith("CARTÃO"):
        return True
    if u.startswith("EMPREST") or u.startswith("EMPRÉST"):
        return True
    # linha de cabeçalho de cartão costuma ter DIA preenchido
    if dia is not None and isinstance(dia, (int, float)) and 1 <= int(dia) <= 31:
        # mas itens também podem ter datas na descrição — só header se nome curto/categoria
        if "COMPRA" in u or "CELULAR" in u or "SOFA" in u or "SOFÁ" in u:
            return False
        if u in {"CARTAO SANTANDER", "CARTÃO SANTANDER"} or "CART" in u:
            return True
    return False


def looks_like_card_row(name: str) -> bool:
    if not name:
        return False
    u = re.sub(r"\s+", " ", name.strip().upper())
    patterns = [
        r"^CART[AÃ]O\b",
        r"^EMPR[EÉ]STIMOS?\b",
    ]
    return any(re.search(p, u) for p in patterns)


def safe_due_date(year: int, month: int, day: int | None) -> date:
    d = 1 if day is None else int(day)
    last = monthrange(year, month)[1]
    return date(year, month, min(d, last))


def to_float(value) -> float | None:
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).strip()
    if not text or text == "-":
        return None
    text = text.replace("R$", "").replace(" ", "")
    if "," in text and "." in text:
        text = text.replace(".", "").replace(",", ".")
    elif "," in text:
        text = text.replace(",", ".")
    try:
        return float(text)
    except ValueError:
        return None


def extract_lancamentos(path: Path) -> list[dict]:
    wb = load_workbook(path, data_only=True)
    ws = wb.active

    # Descobrir colunas de mês na linha 1 (ou 2 se título)
    header_row = 1
    for r in range(1, 5):
        vals = [ws.cell(r, c).value for c in range(1, min(30, ws.max_column + 1))]
        parsed = [parse_month_header(v) for v in vals]
        if sum(1 for p in parsed if p) >= 3:
            header_row = r
            break

    month_cols: list[tuple[int, int, int]] = []  # col, year, month
    for c in range(1, ws.max_column + 1):
        parsed = parse_month_header(ws.cell(header_row, c).value)
        if parsed:
            year, month = parsed
            month_cols.append((c, year, month))

    if not month_cols:
        raise SystemExit("Não encontrei colunas de mês na planilha.")

    # Coluna A = descrição, B = DIA (na maioria dos casos)
    desc_col = 1
    dia_col = 2

    lancamentos: list[dict] = []
    current_card = None
    current_dia: int | None = None

    for r in range(header_row + 1, ws.max_row + 1):
        raw_name = ws.cell(r, desc_col).value
        if raw_name is None:
            continue
        name = str(raw_name).strip()
        if not name:
            continue
        upper = name.upper()
        if upper.startswith("TOTAL") or "CONTROLE FINANCEIRO" in upper:
            continue

        dia_val = ws.cell(r, dia_col).value
        dia_num = None
        if isinstance(dia_val, (int, float)) and 1 <= float(dia_val) <= 31:
            dia_num = int(dia_val)

        if looks_like_card_row(name):
            current_card = re.sub(r"\s+", " ", name).upper()
            current_card = (
                current_card.replace("CARTAO", "CARTÃO")
                .replace("EMPRESTIMOS", "EMPRÉSTIMOS")
                .replace("ATACADAO", "ATACADÃO")
                .replace("SAO VICENTE", "SÃO VICENTE")
            )
            current_dia = dia_num
            # linha de cartão é subtotal — não gera lançamento próprio
            continue

        if current_card is None:
            continue

        for col, year, month in month_cols:
            valor = to_float(ws.cell(r, col).value)
            if valor is None or abs(valor) < 0.0001:
                continue
            venc = safe_due_date(year, month, current_dia)
            mes_nome = MES_NOME.get(month, str(month))
            lancamentos.append(
                {
                    "data_vencimento": venc,
                    "dia": current_dia,
                    "mes_ref": f"{mes_nome}/{year}",
                    "ano": year,
                    "mes": month,
                    "cartao": current_card,
                    "descricao": name,
                    "valor": round(valor, 2),
                }
            )

    lancamentos.sort(key=lambda x: (x["data_vencimento"], x["cartao"], x["descricao"]))
    return lancamentos


def write_output(lancamentos: list[dict], out_path: Path) -> None:
    thin = Border(
        left=Side(style="thin", color="D0D0D0"),
        right=Side(style="thin", color="D0D0D0"),
        top=Side(style="thin", color="D0D0D0"),
        bottom=Side(style="thin", color="D0D0D0"),
    )
    header_fill = PatternFill("solid", fgColor="1F4E79")
    header_font = Font(bold=True, color="FFFFFF", name="Calibri", size=11)
    zebra = PatternFill("solid", fgColor="F2F2F2")

    wb = Workbook()
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
    for col in range(1, 7):
        cell = ws.cell(1, col)
        cell.fill = header_fill
        cell.font = header_font
        cell.border = thin
        cell.alignment = Alignment(horizontal="center")

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
            if i % 2:
                cell.fill = zebra
        ws.cell(r, 1).number_format = "DD/MM/YYYY"
        ws.cell(r, 6).number_format = "R$ #,##0.00"

    for i, w in enumerate([16, 8, 18, 24, 50, 14], 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.auto_filter.ref = f"A1:F{len(lancamentos) + 1}"
    ws.freeze_panes = "A2"

    # Resumo por vencimento+cartão
    ws2 = wb.create_sheet("Resumo por Vencimento")
    ws2.append(["Data Vencimento", "Cartão", "Qtd Lançamentos", "Total (R$)"])
    for col in range(1, 5):
        cell = ws2.cell(1, col)
        cell.fill = header_fill
        cell.font = header_font
        cell.border = thin

    grupos: dict[tuple, list[float]] = defaultdict(list)
    for row in lancamentos:
        grupos[(row["data_vencimento"], row["cartao"])].append(row["valor"])
    r = 2
    for (venc, cartao), vals in sorted(grupos.items()):
        ws2.append([venc, cartao, len(vals), round(sum(vals), 2)])
        ws2.cell(r, 1).number_format = "DD/MM/YYYY"
        ws2.cell(r, 4).number_format = "R$ #,##0.00"
        for c in range(1, 5):
            ws2.cell(r, c).border = thin
        r += 1
    for i, w in enumerate([16, 24, 16, 14], 1):
        ws2.column_dimensions[get_column_letter(i)].width = w
    ws2.auto_filter.ref = f"A1:D{max(1, r - 1)}"
    ws2.freeze_panes = "A2"

    # Por cartão
    ws3 = wb.create_sheet("Por Cartão")
    ws3.append(["Cartão", "Descrição", "Data Vencimento", "Mês Referência", "Valor (R$)"])
    for col in range(1, 6):
        cell = ws3.cell(1, col)
        cell.fill = header_fill
        cell.font = header_font
        cell.border = thin
    ordered = sorted(lancamentos, key=lambda x: (x["cartao"], x["data_vencimento"], x["descricao"]))
    for i, row in enumerate(ordered):
        ws3.append(
            [row["cartao"], row["descricao"], row["data_vencimento"], row["mes_ref"], row["valor"]]
        )
        rr = i + 2
        ws3.cell(rr, 3).number_format = "DD/MM/YYYY"
        ws3.cell(rr, 5).number_format = "R$ #,##0.00"
        for c in range(1, 6):
            ws3.cell(rr, c).border = thin
    for i, w in enumerate([24, 50, 16, 18, 14], 1):
        ws3.column_dimensions[get_column_letter(i)].width = w
    ws3.auto_filter.ref = f"A1:E{len(ordered) + 1}"
    ws3.freeze_panes = "A2"

    wb.save(out_path)


def main() -> None:
    if len(sys.argv) < 2:
        print("Uso: python3 converter_planilha.py <arquivo.xlsx> [saida.xlsx]")
        sys.exit(1)
    src = Path(sys.argv[1]).expanduser().resolve()
    if not src.exists():
        raise SystemExit(f"Arquivo não encontrado: {src}")
    out = (
        Path(sys.argv[2]).expanduser().resolve()
        if len(sys.argv) > 2
        else src.with_name("LISTAGEM - PARCELAMENTOS POR VENCIMENTO.xlsx")
    )
    lancamentos = extract_lancamentos(src)
    write_output(lancamentos, out)
    total = sum(r["valor"] for r in lancamentos)
    print(f"Gerados {len(lancamentos)} lançamentos → {out}")
    print(f"Total: R$ {total:,.2f}")


if __name__ == "__main__":
    main()
