import os
import re
import shutil

repo_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.join(repo_dir, 'app')
template_path = os.path.join(app_dir, 'index.template.html')
dev_index_path = os.path.join(app_dir, 'index.html')
out_app = os.path.join(repo_dir, 'Detox-Primavera-App.html')
out_index = os.path.join(repo_dir, 'index.html')

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. Assemble app/index.html from app/index.template.html
template_content = read_file(template_path)

def include_replacer(match):
    rel_path = match.group(1).strip()
    full_path = os.path.join(repo_dir, rel_path)
    if not os.path.isfile(full_path):
        raise FileNotFoundError(f"Include file not found: {full_path}")
    return read_file(full_path)

dev_html = re.sub(r'<!--\s*INCLUDE:\s*(.*?)\s*-->', include_replacer, template_content)
write_file(dev_index_path, dev_html)
print(f"Compiled dev HTML: {dev_index_path} ({os.path.getsize(dev_index_path):,} bytes)")

# 2. Build single-file production bundles (Detox-Primavera-App.html & index.html)
prod_html = dev_html

# Inline CSS
css_content = read_file(os.path.join(app_dir, 'styles.css'))
prod_html = prod_html.replace('<link rel="stylesheet" href="styles.css">', f'<style>\n{css_content}\n</style>')

# Inline Data & Engine scripts
scripts_to_inline = [
    ('detox-data.js', os.path.join(app_dir, 'detox-data.js')),
    ('fridge-engine.js', os.path.join(app_dir, 'fridge-engine.js')),
    ('core/core.js', os.path.join(app_dir, 'core', 'core.js')),
    ('modules/dia/dia.js', os.path.join(app_dir, 'modules', 'dia', 'dia.js')),
    ('modules/recetas/recetas.js', os.path.join(app_dir, 'modules', 'recetas', 'recetas.js')),
    ('modules/heladera/heladera.js', os.path.join(app_dir, 'modules', 'heladera', 'heladera.js')),
    ('modules/batch/batch.js', os.path.join(app_dir, 'modules', 'batch', 'batch.js')),
    ('modules/remojos/remojos.js', os.path.join(app_dir, 'modules', 'remojos', 'remojos.js')),
    ('modules/compras/compras.js', os.path.join(app_dir, 'modules', 'compras', 'compras.js')),
    ('modules/semaforo/semaforo.js', os.path.join(app_dir, 'modules', 'semaforo', 'semaforo.js')),
    ('modules/sos/sos.js', os.path.join(app_dir, 'modules', 'sos', 'sos.js')),
    ('modules/herbolario/herbolario.js', os.path.join(app_dir, 'modules', 'herbolario', 'herbolario.js')),
    ('app.js', os.path.join(app_dir, 'app.js')),
]

for script_tag_src, script_path in scripts_to_inline:
    tag = f'<script src="{script_tag_src}"></script>'
    if tag not in prod_html:
        raise ValueError(f"Target script tag not found in HTML: {tag}")
    content = read_file(script_path)
    prod_html = prod_html.replace(tag, f'<script>\n{content}\n</script>')

write_file(out_app, prod_html)
shutil.copyfile(out_app, out_index)

print(f"Bundled standalone production files successfully:")
print(f" - {out_app} ({os.path.getsize(out_app):,} bytes)")
print(f" - {out_index} ({os.path.getsize(out_index):,} bytes)")
