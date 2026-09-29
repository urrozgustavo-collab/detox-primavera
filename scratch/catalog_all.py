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

print("==================================================")
print("1. RECETAS FORMALES (Págs 30 a 38)")
print("==================================================")
# Páginas 30 a 38
# Caldo détox
# Leches vegetales de semillas o frutos secos (Almendras / Cajú)
# DIPS / UNTABLES:
# - Queso crema de tofu
# - Humus de porotos mung
# - Mayonesa de zanahorias
# - Untable de hinojo y cítricos
# - Babaganoush
# - Pasta de remolachas y porotos aduki
# - Pesto de hongos
# - Queso de castañas de cajú y tomillo
# - Untable de cajú
# - Untable de cajú fermentado
# PICKLES:
# - Pickle de rabanitos
# - Pickle de remolacha, nabo y lima
# FERMENTOS:
# - Kimchi
# - Chucrut
# PANIFICADOS:
# - Maravillosas galletas de arroz yamaní
# - Galletas de harina de arroz
# - Pan de quinoa y amaranto sin gluten
# - Pan de centeno de masa madre
# - Pan de trigo sarraceno

print("==================================================")
print("2. RECETAS DE ALIÑOS (Págs 21 a 22)")
print("==================================================")
p21_22 = get_page(21) + "\n" + get_page(22)
for line in p21_22.split('\n'):
    l = line.strip()
    if l.startswith('-') or l.startswith('•') or 'aliño' in l.lower() or 'pesto' in l.lower() or 'vinagreta' in l.lower():
        print("  ALIÑO:", l)

print("==================================================")
print("3. DESAYUNOS Y MERIENDAS CON RECETA / PROPORCIONES (Págs 5, 8-11, 19)")
print("==================================================")
for p in [5, 8, 9, 10, 11, 19]:
    txt = get_page(p)
    for line in txt.split('\n'):
        l = line.strip()
        if any(w in l.lower() for w in ['compota', 'nituke', 'pudding', 'licuado', 'crema', 'chía', 'chia', 'tostada', 'palta']):
            if len(l) < 80:
                print(f"  Pág {p}:", l)

print("==================================================")
print("4. ALMUERZOS Y CENAS CON RECETAS / PREPARACIONES (Págs 6, 12-18)")
print("==================================================")
for p in [6] + list(range(12, 19)):
    txt = get_page(p)
    for line in txt.split('\n'):
        l = line.strip()
        if any(w in l.lower() for w in ['bowl', 'sopa', 'crema', 'risotto', 'temaki', 'guiso', 'salteado', 'ensalada', 'hamburguesa', 'croqueta', 'tartita', 'pastel', 'wok']):
            if len(l) < 80:
                print(f"  Pág {p}:", l)
