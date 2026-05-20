import bs4

file_path = r"D:\intirupati backup\element activeate after\simply-static-1-1779199576\tools\tirumala-tirupati-darshan-crowd-status-today-waiting-time-live\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

soup = bs4.BeautifulSoup(content, 'html.parser')

print("Title:", soup.title.string if soup.title else "None")

# Search for elements with class containing 'crowd' or 'status' or similar
for el in soup.find_all(class_=True):
    classes = el.get('class')
    if any(c for c in classes if 'status' in c or 'gauge' in c or 'crowd' in c or 'wait' in c):
        print(f"Class match: {classes} - Tag: {el.name} - text snippet: {el.get_text()[:60].strip()}")
        break # Just see first match
