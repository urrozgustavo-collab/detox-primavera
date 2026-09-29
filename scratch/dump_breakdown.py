import sys

with open('scratch/guia_dump.txt', 'r', encoding='utf-8') as f:
    text = f.read()

pages = text.split("==================== PÁGINA ")

def get_page(n):
    for p in pages:
        if p.startswith(f"{n} ===================="):
            return p
    return ""

with open('scratch/detailed_breakdown.txt', 'w', encoding='utf-8') as out:
    out.write("=== RECETAS FORMALES P30-39 ===\n")
    for p in range(30, 40):
        out.write(f"\n--- PAGINA {p} ---\n")
        out.write(get_page(p))
        
    out.write("\n\n=== ALIÑOS P20-23 ===\n")
    for p in range(20, 24):
        out.write(f"\n--- PAGINA {p} ---\n")
        out.write(get_page(p))

    out.write("\n\n=== DESAYUNOS P5, 8-11 ===\n")
    for p in [5, 8, 9, 10, 11]:
        out.write(f"\n--- PAGINA {p} ---\n")
        out.write(get_page(p))

    out.write("\n\n=== ALMUERZOS Y CENAS P6, 12-18 ===\n")
    for p in [6] + list(range(12, 19)):
        out.write(f"\n--- PAGINA {p} ---\n")
        out.write(get_page(p))

print("Dumped detailed breakdown to scratch/detailed_breakdown.txt")
