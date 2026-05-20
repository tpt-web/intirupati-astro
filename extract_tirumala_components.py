import bs4

file_path = r"D:\intirupati backup\element activeate after\simply-static-1-1779199576\tools\tirumala-tirupati-darshan-crowd-status-today-waiting-time-live\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

soup = bs4.BeautifulSoup(content, 'html.parser')

# Find all script tags containing Jina API or similar
for i, s in enumerate(soup.find_all('script')):
    s_text = s.string or ""
    if 'jina' in s_text or 'fetchData' in s_text or 'fallback' in s_text:
        with open(f"extracted_tirumala_script_{i}.js", "w", encoding="utf-8") as out:
            out.write(s_text)
        print(f"Wrote script {i} of length {len(s_text)}")

# Find all styles containing crowd status custom styling (e.g. tdcs- or similar)
styles = [s.string for s in soup.find_all('style') if s.string and ('tdcs-' in s.string or 'gauge' in s.string or 'waiting' in s.string)]
print(f"Found {len(styles)} style tags for Tirumala crowd status.")
for i, style in enumerate(styles):
    with open(f"extracted_tirumala_style_{i}.css", "w", encoding="utf-8") as out:
        out.write(style)
    print(f"Wrote style {i} of length {len(style)}")
