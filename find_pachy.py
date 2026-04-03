with open('src/DinoGamePlus.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

out = []
for i, line in enumerate(lines, 1):
    if 'pachy' in line.lower() or 'revive' in line.lower() or 'invTimer=50' in line or 'invTimer=30' in line:
        out.append(f"{i}: {repr(line)}")

with open('pachy_lines.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))
