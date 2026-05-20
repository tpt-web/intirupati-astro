import re

with open(r"D:\intirupati backup\intirupati\tools\meesho-label-crop-tool-free\index.html", "r", encoding="utf-8") as f:
    content = f.read()

ids = ['m2-chip-remove', 'm2-sort-courier', 'm2-sort-sku', 'm2-process-btn', 'm2-dl-pdf', 'm2-dl-zip', 'm2-canvas', 'm2-work-canvas']

for identifier in ids:
    matches = [m.start() for m in re.finditer(re.escape(identifier), content)]
    print(f"ID {identifier} matches count: {len(matches)}")
    for p in matches:
        surrounding = content[max(0, p-100):p+150]
        cleaned = surrounding.replace("\n", " ").encode('ascii', errors='backslashreplace').decode('ascii')
        print(f"  Match at {p}: {cleaned}")
