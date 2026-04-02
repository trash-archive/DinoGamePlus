with open('src/DinoGamePlus.jsx', 'r', encoding='utf-8') as f:
    data = f.read()

replacements = [
    # Template literal costs
    ('`\u25c8${cost}`',                '`\u25c8 ${cost}`'),
    ('`\u25c8${def.unlockCost} UNLOCK`', '`\u25c8 ${def.unlockCost} UNLOCK`'),
    ('`\u25c8${d.cost}`',              '`\u25c8 ${d.cost}`'),
    ('`\u25c8${sk.cost}`',             '`\u25c8 ${sk.cost}`'),
    ('`\u25c8${s.cost}`',              '`\u25c8 ${s.cost}`'),
]

for old, new in replacements:
    data = data.replace(old, new)

with open('src/DinoGamePlus.jsx', 'w', encoding='utf-8') as f:
    f.write(data)
print("Done")
