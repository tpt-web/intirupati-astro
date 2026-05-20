import re
import bs4

file_path = r"D:\intirupati backup\element activeate after\simply-static-1-1779199576\tools\meesho-label-crop-tool-free\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's count scripts and check matches
print(f"File size: {len(content)} bytes")
matches = [m.start() for m in re.finditer(r'm2-file-input', content)]
print(f"Total 'm2-file-input' matches: {len(matches)}")

for p in matches:
    surrounding = content[max(0, p-300):p+300]
    print(f"Match at {p}:")
    cleaned = surrounding.encode('ascii', errors='backslashreplace').decode('ascii')
    print(cleaned)
    print("="*40)

# Extract any scripts that contain m2-
soup = bs4.BeautifulSoup(content, 'html.parser')
found_scripts = []
for s in soup.find_all('script'):
    text = s.string or s.text
    if 'm2-file-input' in text or 'm2-process-btn' in text:
        found_scripts.append(text)

print(f"Found scripts with tool logic: {len(found_scripts)}")
for i, script in enumerate(found_scripts):
    with open(f"extracted_larger_script_{i}.js", "w", encoding="utf-8") as out:
        out.write(script)
    print(f"Wrote extracted_larger_script_{i}.js (length: {len(script)})")
