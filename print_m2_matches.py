import re

with open(r"D:\intirupati backup\intirupati\tools\meesho-label-crop-tool-free\index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for matches of 'm2-file-input' and print around them
for m in re.finditer(r'm2-file-input', content):
    p = m.start()
    surrounding = content[max(0, p-300):p+300]
    print(f"Match at {p}:")
    # Clean non-ascii for console printing
    cleaned = surrounding.encode('ascii', errors='backslashreplace').decode('ascii')
    print(cleaned)
    print("="*40)
