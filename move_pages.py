import os

src_dir = r"d:\intirupati backup\intirupati\intirupati-astro\src\content\blog"
dest_dir = r"d:\intirupati backup\intirupati\intirupati-astro\src\pages"

pages = ['about.md', 'contact-us.md', 'disclaimer.md', 'privacy-policy.md', 'terms-and-conditions.md']

# Delete about.astro if exists
about_astro = os.path.join(dest_dir, 'about.astro')
if os.path.exists(about_astro):
    os.remove(about_astro)
    print("Deleted about.astro")

for p in pages:
    src_path = os.path.join(src_dir, p)
    dest_path = os.path.join(dest_dir, p)
    if os.path.exists(src_path):
        with open(src_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Add layout to frontmatter if not present
        if 'layout:' not in content:
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = parts[1]
                body = parts[2]
                new_frontmatter = frontmatter + "\nlayout: ../layouts/BlogPost.astro"
                content = f"---{new_frontmatter}---{body}"
                
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Delete from blog folder
        os.remove(src_path)
        print(f"Moved {p} to pages and added layout")
    else:
        print(f"Source file {p} not found in content/blog")
