import bs4

file_path = r"D:\intirupati backup\element activeate after\simply-static-1-1779199576\tools\tirumala-tirupati-darshan-crowd-status-today-waiting-time-live\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

soup = bs4.BeautifulSoup(content, 'html.parser')

styles = [s.string for s in soup.find_all('style') if s.string and 'bdp-' in s.string]
print(f"Found {len(styles)} style tags with bdp- styling.")

for i, style in enumerate(styles):
    with open(f"extracted_bdp_style_{i}.css", "w", encoding="utf-8") as out:
        out.write(style)
    print(f"Wrote extracted_bdp_style_{i}.css (length: {len(style)} characters)")
