import re

with open('src/DinoGamePlus.jsx', 'rb') as f:
    data = f.read()

# The broken pattern: icon strings where the closing " was replaced with E,
# e.g. icon:"\xe2\x86\x81E,  -> icon:"\xe2\x86\x81",
# Pattern: icon:"<bytes>E,  (where E, should be ",)
# Also fix JSX: <span ...>◁E/span> -> <span ...>◆</span>

# Fix 1: icon fields - replace `E,  cat:` with `",  cat:` and `E\", cat:` with `\", cat:`
# The broken ones end with some bytes then literal E, before the cat: key
# Replace pattern: icon:"...E,  cat: -> icon:"...",  cat:
fixed = re.sub(
    b'(icon:\"[^\"E]*)E,  cat:',
    b'\\1",  cat:',
    data
)
fixed = re.sub(
    b'(icon:\"[^\"E]*)E\", cat:',
    b'\\1", cat:',
    fixed
)

# Fix 2: JSX spans with broken closing: >◁E/span> -> >◆</span>
# The pattern is some unicode bytes then E/span>
fixed = re.sub(
    b'>([\xe2-\xef][\x80-\xbf][\x80-\xbf])E</span>',
    b'>\\1</span>',
    fixed
)
# Also handle: >◁E/span> where it's literally E/span> without the <
fixed = re.sub(
    b'>([\xe2-\xef][\x80-\xbf][\x80-\xbf])E/span>',
    b'>\\1</span>',
    fixed
)

# Fix 3: icon fields ending with E\", cat: (single space variant)
fixed = re.sub(
    b'(icon:\"[^\"E]*)E\", cat:',
    b'\\1", cat:',
    fixed
)

# Count changes
changes = data.count(b'E,  cat:') + data.count(b'E/span>')
print(f"Patterns found: E,  cat: = {data.count(b'E,  cat:')}, E/span> = {data.count(b'E/span>')}")
print(f"After fix: E,  cat: = {fixed.count(b'E,  cat:')}, E/span> = {fixed.count(b'E/span>')}")

with open('src/DinoGamePlus.jsx', 'wb') as f:
    f.write(fixed)
print("Done")
