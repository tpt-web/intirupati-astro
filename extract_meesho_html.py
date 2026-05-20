import re

file_path = r"D:\intirupati backup\element activeate after\simply-static-1-1779199576\tools\meesho-label-crop-tool-free\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's find index of '<!-- TOOL CARD -->' and '<!-- HOW TO USE -->'
p_start = content.find('<!-- TOOL CARD -->')
p_end = content.find('<!-- HOW TO USE -->')

if p_start != -1 and p_end != -1:
    extracted = content[p_start:p_end]
    # Clean emojis or other non-ascii for safe output
    with open("meesho_extracted_tool_card.html", "w", encoding="utf-8") as out:
        out.write(extracted)
    print(f"Extracted tool card HTML (size: {len(extracted)} characters)")
else:
    print("Comments not found")
