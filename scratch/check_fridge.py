with open('app/fridge-engine.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'"([a-zA-Z0-9_-]+)"\s*:\s*\[', text)
print("Keys:", matches[:10])

# Check if recipesMatchingCatalog exists
if "recipesMatchingCatalog" in text:
    print("Found recipesMatchingCatalog!")
    # Find all recipe ids
    ids = re.findall(r'"id"\s*:\s*"([^"]+)"', text[text.find("recipesMatchingCatalog"):])
    print(f"Total recipe ids in fridge engine: {len(ids)}")
    print("IDs:", ids)
