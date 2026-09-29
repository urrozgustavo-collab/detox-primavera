import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/guia_dump.txt', 'r', encoding='utf-8') as f:
    text = f.read()

pages = text.split("==================== PÁGINA ")

def get_page(n):
    for p in pages:
        if p.startswith(f"{n} ===================="):
            return p
    return ""

print("=== DESAYUNOS P8 A 11 ===")
for p in range(8, 12):
    print(f"--- PÁGINA {p} ---")
    print(get_page(p))

print("=== ALMUERZOS Y CENAS P12 A 18 ===")
for p in range(12, 19):
    print(f"--- PÁGINA {p} ---")
    print(get_page(p))
