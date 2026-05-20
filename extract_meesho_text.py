import bs4

file_path = r"D:\intirupati backup\element activeate after\simply-static-1-1779199576\tools\meesho-label-crop-tool-free\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

soup = bs4.BeautifulSoup(content, 'html.parser')

# Let's print out all h2, h3, and paragraph texts
for el in soup.find_all(['h2', 'h3', 'p', 'li']):
    # Skip header/footer elements if any
    text = el.get_text().strip()
    if text and len(text) > 10:
        cleaned = text.encode('ascii', errors='backslashreplace').decode('ascii')
        print(f"[{el.name}]: {cleaned[:150]}...")
