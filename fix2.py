with open('src/DinoGamePlus.jsx', 'r', encoding='utf-8') as f:
    data = f.read()

before = data.count('◁')
# Replace all ◁E${...} template literal cost displays with ◈${...}
data = data.replace('`◁E${cost}`', '`◈${cost}`')
data = data.replace('`◈${cost}`', '`◈${cost}`')  # idempotent
data = data.replace('`◁E${def.unlockCost} UNLOCK`', '`◈${def.unlockCost} UNLOCK`')
data = data.replace('`◁E${d.cost}`', '`◈${d.cost}`')
data = data.replace('`◁E${sk.cost}`', '`◈${sk.cost}`')
data = data.replace('`◁E${s.cost}`', '`◈${s.cost}`')

# Replace ◁ icon in UPGRADES array entries (icon field)
data = data.replace('icon:"◁",  cat:"income"', 'icon:"◈",  cat:"income"')
data = data.replace('icon:"◁",  cat:"survival"', 'icon:"◈",  cat:"survival"')
data = data.replace('icon:"◁", cat:"powerups"', 'icon:"◈", cat:"powerups"')

# Replace the game HUD span (◁ in game screen header bar)
data = data.replace('<span style={{fontSize:14,color:DARK}}>◁</span>', '<span style={{fontSize:14,color:DARK}}>◈</span>')

after = data.count('◁')
print(f"before: {before}, after: {after}")

with open('src/DinoGamePlus.jsx', 'w', encoding='utf-8') as f:
    f.write(data)
print("Done")
