with open('scratch/recetas_extraidas.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect the exact titles in the formal "Recetas" section (p. 30 to 40)
p30_40 = text.split("=== SECCIÓN RECETAS (Págs 30-41) ===")[1].split("=== SECCIÓN DESAYUNOS")[0]

print("=== FORMAL RECETAS SECTION (P30-40) ===")
for line in p30_40.split('\n'):
    l = line.strip()
    if not l:
        continue
    # If line looks like a title (short, distinct)
    if len(l) < 60 and not l.startswith('•') and not l.startswith('-') and not l.startswith('1.') and not l.startswith('2.') and not l.startswith('3.') and not l.startswith('4.'):
        if any(keyword in l.lower() for keyword in ['caldo', 'leche', 'dips', 'tofu', 'humus', 'mayonesa', 'untable', 'babaganoush', 'pasta', 'pesto', 'queso', 'pickles', 'pickle', 'kimchi', 'chucrut', 'panificados', 'galletas', 'pan', 'receta']):
            print("RECIPE CANDIDATE:", l)
