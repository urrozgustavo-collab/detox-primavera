import os
import shutil

repo_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.join(repo_dir, 'app')
out_app = os.path.join(repo_dir, 'Detox-Primavera-App.html')
out_index = os.path.join(repo_dir, 'index.html')

with open(os.path.join(app_dir, 'index.html'), encoding='utf-8') as f:
    html = f.read()
with open(os.path.join(app_dir, 'styles.css'), encoding='utf-8') as f:
    css = f.read()
with open(os.path.join(app_dir, 'detox-data.js'), encoding='utf-8') as f:
    data_js = f.read()
with open(os.path.join(app_dir, 'app.js'), encoding='utf-8') as f:
    app_js = f.read()

# Replace css link with inline style
html = html.replace('<link rel="stylesheet" href="styles.css">', f'<style>\n{css}\n</style>')

# Replace detox-data.js script with inline script
html = html.replace('<script src="detox-data.js"></script>', f'<script>\n{data_js}\n</script>')

# Replace app.js script with inline script
html = html.replace('<script src="app.js"></script>', f'<script>\n{app_js}\n</script>')

with open(out_app, 'w', encoding='utf-8') as f:
    f.write(html)

shutil.copyfile(out_app, out_index)

print(f"Bundled successfully:\n - {out_app} ({os.path.getsize(out_app):,} bytes)\n - {out_index} ({os.path.getsize(out_index):,} bytes)")
