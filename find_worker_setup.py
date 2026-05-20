import re

file_path = r"D:\intirupati backup\element activeate after\simply-static-1-1779199576\tools\meesho-label-crop-tool-free\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

for m in re.finditer(r'GlobalWorkerOptions', content):
    p = m.start()
    surrounding = content[max(0, p-150):p+150]
    cleaned = surrounding.replace("\n", " ").encode('ascii', errors='backslashreplace').decode('ascii')
    print(cleaned)
    print("="*40)
