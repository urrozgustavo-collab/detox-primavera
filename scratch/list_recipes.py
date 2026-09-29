with open('scratch/recetas_extraidas.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines in extracted: {len(lines)}")
# Let's print out the titles and sections in recetas_extraidas
for i, line in enumerate(lines):
    l = line.strip()
    # Check for recipe headers or bullet points
    if line.startswith("===") or line.startswith("===================="):
        print(l)
    elif len(l) > 2 and len(l) < 50 and (l.isupper() or l.istitle() or l.startswith("•") or l.startswith("-") or l.startswith("Receta") or l.startswith("Ingredientes") or l.startswith("Preparación") or l.startswith("Opción")):
        # print if it looks like a recipe name
        if any(w in l.lower() for w in ['receta', 'salsa', 'aliño', 'pan', 'gallet', 'untable', 'pasta', 'dip', 'caldo', 'leche', 'queso', 'pickle', 'kimchi', 'chucrut', 'pesto', 'humus', 'mayonesa', 'babaganoush', 'bowl', 'sopa', 'ensalada', 'arroz', 'compota', 'pudding', 'licuado']):
            print(f"  Line {i}: {l}")
