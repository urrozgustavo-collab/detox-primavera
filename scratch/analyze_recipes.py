import fitz
import re
import json

# 1. Analizar detox-data.js
with open('app/detox-data.js', 'r', encoding='utf-8') as f:
    js_text = f.read()

# Buscar titulos de recetas en js_text
recipe_titles_js = re.findall(r'titulo:\s*"([^"]+)"', js_text)
print(f"=== RECETAS EN DETOX-DATA.JS (Total: {len(recipe_titles_js)}) ===")
for i, t in enumerate(recipe_titles_js):
    print(f"{i+1}. {t}")

# 2. Analizar guia-detox-primavera.pdf
doc = fitz.open('guia-detox-primavera.pdf')
print(f"\n=== GUIA-DETOX-PRIMAVERA.PDF (Total páginas: {len(doc)}) ===")

# Revisar página a página
pdf_text_by_page = {}
for i, page in enumerate(doc):
    pdf_text_by_page[i+1] = page.get_text()

# Veamos las páginas 20 a 40 con detalle
print("\n--- INDICE DETALLADO DE PAGINAS 20 A 40 ---")
for p in range(20, 41):
    txt = pdf_text_by_page[p]
    lines = [l.strip() for l in txt.split('\n') if l.strip()]
    first_lines = lines[:3] if lines else []
    print(f"Pág {p}: {' | '.join(first_lines)}")

# Además, revisar páginas 5 a 20 donde hay preparaciones, desayunos, almuerzos, cenas, bebidas
print("\n--- RESUMEN DE PAGINAS 5 A 20 ---")
for p in range(5, 20):
    txt = pdf_text_by_page[p]
    lines = [l.strip() for l in txt.split('\n') if l.strip()]
    first_lines = lines[:4] if lines else []
    print(f"Pág {p}: {' | '.join(first_lines)}")
