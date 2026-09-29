import re

with open('app/detox-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Find the recipes array
start_idx = text.find('recipes: [')
if start_idx != -1:
    end_idx = text.find('\n  ],', start_idx)
    recipes_text = text[start_idx:end_idx+5]
    print(f"Recipes block length: {len(recipes_text)}")
    # Count objects with 'id:'
    ids = re.findall(r'id:\s*"([^"]+)"', recipes_text)
    print(f"Existing recipe IDs ({len(ids)}):", ids)
