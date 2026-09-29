import re

with open('scratch/guia_dump.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect sections:
# 1. Aliños (pág 21-22)
# 2. Métodos de cocción (pág 27-29)
# 3. Recetas (pág 30-40)
# 4. Desayunos / meriendas / almuerzos / cenas (pág 5-19)

pages = text.split("==================== PÁGINA ")

print(f"Total pages parsed: {len(pages)-1}")

def show_page(num):
    for p in pages:
        if p.startswith(f"{num} ===================="):
            return p
    return ""

# Inspect pages 21 to 40
with open('scratch/recetas_extraidas.txt', 'w', encoding='utf-8') as out:
    out.write("=== SECCIÓN ALIÑOS (Págs 21-23) ===\n")
    for p in range(21, 24):
        out.write(show_page(p) + "\n")
        
    out.write("\n=== SECCIÓN RECETAS (Págs 30-41) ===\n")
    for p in range(30, 41):
        out.write(show_page(p) + "\n")
        
    out.write("\n=== SECCIÓN DESAYUNOS Y MERIENDAS (Págs 5-11, 19) ===\n")
    for p in [5, 6, 8, 9, 10, 11, 19]:
        out.write(show_page(p) + "\n")

    out.write("\n=== SECCIÓN ALMUERZOS Y CENAS (Págs 12-18) ===\n")
    for p in range(12, 19):
        out.write(show_page(p) + "\n")

print("Wrote scratch/recetas_extraidas.txt successfully.")
