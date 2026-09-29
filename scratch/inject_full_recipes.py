import json
import re

# Read current detox-data.js
with open('app/detox-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Read the full recipes
with open('scratch/full_recipes_catalog.json', 'r', encoding='utf-8') as f:
    recipes = json.load(f)

# Find boundary of recipes: [ ... ] in detox-data.js
recipes_start = text.find('recipes: [')
if recipes_start == -1:
    raise ValueError("recipes: [ not found in app/detox-data.js")

traffic_light_start = text.find('foodTrafficLight:', recipes_start)
if traffic_light_start == -1:
    raise ValueError("foodTrafficLight: not found in app/detox-data.js")

# Find the end of recipes array: the last '],\n\n  ' before foodTrafficLight
end_bracket = text.rfind('],', recipes_start, traffic_light_start)
if end_bracket == -1:
    raise ValueError("Closing bracket for recipes not found")

# Format new recipes as JavaScript
recipes_formatted = json.dumps(recipes, ensure_ascii=False, indent=4)
# Indent recipes_formatted so it fits nicely inside detox-data.js
# each line gets 2 extra spaces, except first line
lines = recipes_formatted.split('\n')
indented_lines = ['  recipes: ' + lines[0]]
for line in lines[1:]:
    indented_lines.append('  ' + line)
new_recipes_block = '\n'.join(indented_lines) + ','

new_content = text[:recipes_start] + new_recipes_block + '\n\n  ' + text[traffic_light_start:]

with open('app/detox-data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully updated app/detox-data.js with {len(recipes)} recipes!")
print(f"New file size: {len(new_content):,} chars")
