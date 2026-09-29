with open('app/fridge-engine.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos = text.find('"recipesMapping"')
if pos != -1:
    print(text[pos:pos+1500])
