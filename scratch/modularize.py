import os
import re

repo_dir = r'c:\Users\urroz\Proyectos\04_productividad_herramientas\salud-recetas\detox-primavera'
app_dir = os.path.join(repo_dir, 'app')
index_file = os.path.join(app_dir, 'index.html')

with open(index_file, encoding='utf-8') as f:
    content = f.read()

# Directories to create
core_dir = os.path.join(app_dir, 'core')
modules_dir = os.path.join(app_dir, 'modules')

for d in [core_dir, modules_dir]:
    os.makedirs(d, exist_ok=True)

modules = ['dia', 'recetas', 'heladera', 'batch', 'remojos', 'compras', 'semaforo', 'sos', 'herbolario']
for m in modules:
    os.makedirs(os.path.join(modules_dir, m), exist_ok=True)

# 1. Header (lines from <!-- Topbar Header to </nav> before <main>)
header_match = re.search(r'(<!-- Topbar Header[\s\S]*?<\/nav>)(\s*<!-- Main Content Area -->)', content)
if not header_match:
    raise Exception("Header not matched")
header_html = header_match.group(1)

# 2. Dia section
dia_match = re.search(r'(<!-- ========================================== -->\s*<!-- PESTANA 1: MI DIA & TRACKER 21 DIAS[\s\S]*?<\/section>)', content)
if not dia_match:
    raise Exception("Dia section not matched")
dia_html = dia_match.group(1)

# 3. Recetario section & subviews
recetas_sec_match = re.search(r'(<!-- ========================================== -->\s*<!-- PESTANA 2: RECETARIO & COCINA INTELIGENTE[\s\S]*?<\/section>)', content)
if not recetas_sec_match:
    raise Exception("Recetas section not matched")
recetas_sec_html = recetas_sec_match.group(1)

# Extract subview catalogo
catalogo_match = re.search(r'(<!-- SUBVISTA 1: CATÁLOGO CLÁSICO DE RECETAS[\s\S]*?<\/div>\s*<\/div>)(\s*<!-- ========================================== -->\s*<!-- SUBVISTA 2: HELADERA INTELIGENTE)', recetas_sec_html)
if not catalogo_match:
    # Try alternate match
    catalogo_match = re.search(r'(<!-- ========================================== -->\s*<!-- SUBVISTA 1: CATÁLOGO CLÁSICO DE RECETAS[\s\S]*?)(<!-- ========================================== -->\s*<!-- SUBVISTA 2: HELADERA INTELIGENTE)', recetas_sec_html)
if not catalogo_match:
    raise Exception("Catalogo subview not matched")
catalogo_html = catalogo_match.group(1).strip()

# Extract subview heladera
heladera_match = re.search(r'(<!-- ========================================== -->\s*<!-- SUBVISTA 2: HELADERA INTELIGENTE[\s\S]*?)(<!-- ========================================== -->\s*<!-- SUBVISTA 3: BATCH COOKING)', recetas_sec_html)
if not heladera_match:
    raise Exception("Heladera subview not matched")
heladera_html = heladera_match.group(1).strip()

# Extract subview batch
batch_match = re.search(r'(<!-- ========================================== -->\s*<!-- SUBVISTA 3: BATCH COOKING[\s\S]*?)(<!-- ========================================== -->\s*<!-- SUBVISTA 4: GESTOR DE REMOJOS)', recetas_sec_html)
if not batch_match:
    raise Exception("Batch subview not matched")
batch_html = batch_match.group(1).strip()

# Extract subview remojos
remojos_match = re.search(r'(<!-- ========================================== -->\s*<!-- SUBVISTA 4: GESTOR DE REMOJOS[\s\S]*?<\/div>)(\s*<\/section>)', recetas_sec_html)
if not remojos_match:
    raise Exception("Remojos subview not matched")
remojos_html = remojos_match.group(1).strip()

# Extract switcher nav for recetas
recetas_nav_match = re.search(r'(<!-- Segmented Switcher de Cocina Inteligente[\s\S]*?<\/div>)(\s*<!-- ========================================== -->\s*<!-- SUBVISTA 1)', recetas_sec_html)
if not recetas_nav_match:
    raise Exception("Recetas switcher nav not matched")
recetas_nav_html = recetas_nav_match.group(1).strip()

# Combine recetas catalogue + nav into recetas module
recetas_module_html = f"""<!-- Segmented Switcher de Cocina Inteligente -->
{recetas_nav_html}

{catalogo_html}"""

# 4. Compras section
compras_match = re.search(r'(<!-- ========================================== -->\s*<!-- PESTANA 3: LISTA DE COMPRAS INTERACTIVA[\s\S]*?<\/section>)', content)
if not compras_match:
    raise Exception("Compras section not matched")
compras_html = compras_match.group(1)

# 5. Semaforo section
semaforo_match = re.search(r'(<!-- ========================================== -->\s*<!-- PESTANA 4: SEMAFORO[\s\S]*?<\/section>)', content)
if not semaforo_match:
    raise Exception("Semaforo section not matched")
semaforo_html = semaforo_match.group(1)

# 6. SOS section
sos_match = re.search(r'(<!-- ========================================== -->\s*<!-- PESTANA 5: BOTIQUIN SOS[\s\S]*?<\/section>)', content)
if not sos_match:
    raise Exception("SOS section not matched")
sos_html = sos_match.group(1)

# 7. Herbolario section
herbolario_match = re.search(r'(<!-- ========================================== -->\s*<!-- PESTANA 6: HERBOLARIO[\s\S]*?<\/section>)', content)
if not herbolario_match:
    raise Exception("Herbolario section not matched")
herbolario_html = herbolario_match.group(1)

# 8. Footer
footer_match = re.search(r'(<!-- Footer -->[\s\S]*?<\/footer>)', content)
if not footer_match:
    raise Exception("Footer not matched")
footer_html = footer_match.group(1)

# 9. Modales
modals_match = re.search(r'(<!-- ========================================== -->\s*<!-- MODAL: DETALLES DE RECETA[\s\S]*?<!-- Toast Notification Flotante -->[\s\S]*?<\/div>)(\s*<!-- ========================================== -->\s*<!-- BARRA DE NAVEGACION INFERIOR)', content)
if not modals_match:
    raise Exception("Modals not matched")
modals_html = modals_match.group(1)

# 10. Mobile nav
mobile_nav_match = re.search(r'(<!-- ========================================== -->\s*<!-- BARRA DE NAVEGACION INFERIOR \(CELULAR\)[\s\S]*?<\/nav>)', content)
if not mobile_nav_match:
    raise Exception("Mobile nav not matched")
mobile_nav_html = mobile_nav_match.group(1)

# Save files
files_to_write = {
    os.path.join(core_dir, 'header.html'): header_html,
    os.path.join(core_dir, 'footer.html'): footer_html,
    os.path.join(core_dir, 'modals.html'): modals_html,
    os.path.join(core_dir, 'mobile-nav.html'): mobile_nav_html,
    os.path.join(modules_dir, 'dia', 'dia.html'): dia_html,
    os.path.join(modules_dir, 'recetas', 'recetas.html'): recetas_module_html,
    os.path.join(modules_dir, 'heladera', 'heladera.html'): heladera_html,
    os.path.join(modules_dir, 'batch', 'batch.html'): batch_html,
    os.path.join(modules_dir, 'remojos', 'remojos.html'): remojos_html,
    os.path.join(modules_dir, 'compras', 'compras.html'): compras_html,
    os.path.join(modules_dir, 'semaforo', 'semaforo.html'): semaforo_html,
    os.path.join(modules_dir, 'sos', 'sos.html'): sos_html,
    os.path.join(modules_dir, 'herbolario', 'herbolario.html'): herbolario_html,
}

for path, code in files_to_write.items():
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code.strip() + '\n')
    print(f"Created: {os.path.relpath(path, repo_dir)} ({len(code):,} chars)")

print("\nAll HTML sections successfully modularized!")
