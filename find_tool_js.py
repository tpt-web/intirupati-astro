import re

with open(r"D:\intirupati backup\intirupati\tools\meesho-label-crop-tool-free\index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for script tags or custom scripts in the content
scripts = re.findall(r'<script.*?>x*</script>', content, re.DOTALL | re.IGNORECASE)
print(f"Total script tags: {len(scripts)}")

# Search for matches with 'm2-' in the entire file
matches = [m.start() for m in re.finditer(r'm2-', content)]
print(f"Total 'm2-' matches: {len(matches)}")

# Let's extract any script elements that contain m2- or pdf
import bs4
soup = bs4.BeautifulSoup(content, 'html.parser')
found_scripts = []
for s in soup.find_all('script'):
    text = s.string or s.text
    if 'm2-' in text or 'pdf' in text or 'crop' in text or 'Sort' in text:
        found_scripts.append(text)

print(f"Found scripts with keywords: {len(found_scripts)}")
for i, script in enumerate(found_scripts):
    with open(f"extracted_script_{i}.js", "w", encoding="utf-8") as out:
        out.write(script)
    print(f"Wrote extracted_script_{i}.js (length: {len(script)})")
