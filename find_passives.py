with open('src/DinoGamePlus.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

keywords = [
    'raptorSpeedBonus', 'raptorM', 'pteroM', 'brachioMagnet', 'spinoMult',
    'giantBonusPerKill', 'comboTimer=180', 'triFirst', 'pachyRevive',
    'dilopho', 'anky', 'nearMissBonus', 'designId==="para"',
    'designId==="spino"', 'designId==="brachio"', 'designId==="raptor"',
    'designId==="trex"', 'designId==="stego"', 'designId==="pterodac"',
    'designId==="tri"', 'designId==="pachy"',
]

out = []
for i, line in enumerate(lines, 1):
    if any(k in line for k in keywords):
        out.append(f"{i}: {line.rstrip()}")

with open('passive_impl.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))
