import os
import re

directory = r"d:\intirupati backup\intirupati\intirupati-astro\src\pages"
files_to_fix = [
    "about.md",
    "contact-us.md",
    "disclaimer.md",
    "privacy-policy.md",
    "terms-and-conditions.md"
]

for filename in files_to_fix:
    path = os.path.join(directory, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace 'layout: ../layouts/BlogPost.astro---' with 'layout: ../layouts/BlogPost.astro\n---'
        fixed = re.sub(r'layout:\s*\.\./layouts/BlogPost\.astro---', 'layout: ../layouts/BlogPost.astro\n---', content)
        
        if fixed != content:
            with open(path, "w", encoding="utf-8") as f:
                f.write(fixed)
            print(f"Fixed frontmatter in {filename}")
        else:
            print(f"No changes needed for {filename}")
    else:
        print(f"File {filename} not found at {path}")
