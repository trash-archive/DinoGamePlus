path = r'c:\Users\user\Desktop\FUN IDEAS\dino-game-plus\src\DinoGamePlus.jsx'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'Dash  Efull' in line or 'hasDash' in line or 'hasBackDash' in line or 'playDashForward' in line or 'playDashBack' in line:
        print(f"LINE {i+1}: {repr(line)}")
