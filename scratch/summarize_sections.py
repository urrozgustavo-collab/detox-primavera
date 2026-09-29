with open('scratch/detailed_breakdown.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect each section
sections = text.split("=== ")
for sec in sections:
    if not sec.strip():
        continue
    header = sec.split(" ===")[0]
    print(f"\n**************** {header} ****************")
    body = sec.split(" ===")[1]
    # Let's look for bullet points or recipe titles
    for line in body.split("\n"):
        l = line.strip()
        if not l or l.isdigit():
            continue
        if l.startswith("--- PAGINA"):
            print(f"\n{l}")
        elif any(l.startswith(prefix) for prefix in ["•", "-", "1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10."]) and len(l) < 80:
            print(f"  {l}")
        elif len(l) < 50 and l.isupper():
            print(f"  [CAPS] {l}")
        elif any(k in l.lower() for k in ["caldo", "leche", "queso", "humus", "mayonesa", "untable", "babaganoush", "pasta", "pesto", "pickle", "kimchi", "chucrut", "galletas", "pan ", "aliño", "licuado", "sopa", "crema", "bowl", "temaki", "risotto", "compota"]):
            if len(l) < 70:
                print(f"  [TITLE] {l}")
