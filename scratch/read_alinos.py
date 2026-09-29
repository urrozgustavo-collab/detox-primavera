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

print("=== ALIÑOS COMPLETO (Pág 20-22) ===")
print(get_page(20))
print(get_page(21))
print(get_page(22))
