with open('app/fridge-engine.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
top_keys = re.findall(r'^\s{2}"([a-zA-Z0-9_-]+)"\s*:\s*[{[]', text, re.MULTILINE)
print("Top level keys in FRIDGE_AND_PREP_DATA:", top_keys)
