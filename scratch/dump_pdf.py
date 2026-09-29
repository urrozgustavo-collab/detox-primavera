import fitz
import sys

# Configure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('guia-detox-primavera.pdf')

with open('scratch/guia_dump.txt', 'w', encoding='utf-8') as out:
    for i, page in enumerate(doc):
        out.write(f"\n==================== PÁGINA {i+1} ====================\n")
        out.write(page.get_text())

print("Dumped guia-detox-primavera.pdf to scratch/guia_dump.txt")
