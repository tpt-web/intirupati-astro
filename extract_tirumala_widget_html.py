import bs4

file_path = r"D:\intirupati backup\element activeate after\simply-static-1-1779199576\tools\tirumala-tirupati-darshan-crowd-status-today-waiting-time-live\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

soup = bs4.BeautifulSoup(content, 'html.parser')

bdp_div = soup.find(class_='bdp')
if bdp_div:
    extracted = str(bdp_div)
    with open("tirumala_extracted_widget.html", "w", encoding="utf-8") as out:
        out.write(extracted)
    print(f"Extracted Tirumala widget HTML (size: {len(extracted)} characters)")
else:
    print("No element with class 'bdp' found")
