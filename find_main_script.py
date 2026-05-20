import bs4

file_path = r"D:\intirupati backup\element activeate after\simply-static-1-1779199576\tools\meesho-label-crop-tool-free\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

soup = bs4.BeautifulSoup(content, 'html.parser')

scripts = [s.string for s in soup.find_all('script') if s.string and 'pdfjsLib' in s.string]
print(f"Found {len(scripts)} scripts referencing pdfjsLib.")

for i, script in enumerate(scripts):
    with open(f"extracted_meesho_script_{i}.js", "w", encoding="utf-8") as out:
        out.write(script)
    print(f"Wrote extracted_meesho_script_{i}.js (length: {len(script)} characters)")
