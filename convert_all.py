import os
import re
import sys
import urllib.parse
from bs4 import BeautifulSoup
import html2text

# Ensure Windows terminal outputs UTF-8 correctly
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

source_dir = r"D:\intirupati backup\intirupati"
dest_dir = r"D:\intirupati backup\intirupati\intirupati-astro\src\content\blog"

os.makedirs(dest_dir, exist_ok=True)

# List of folders to ignore
ignore_folders = {
    'intirupati-astro', 'wp-content', 'wp-includes', 'wp-json', 
    'feed', 'comments', 'category', 'author', 'scratch', 
    'simply-static-1-1779199576', 'page', '.git', '.vscode', '.gemini'
}

def clean_html_content(soup):
    # Remove script, style, noscript, iframe tags
    for tag in soup.find_all(['script', 'style', 'noscript', 'iframe']):
        tag.decompose()
    
    # Remove adsense and other layout elements that shouldn't be in markdown
    for tag in soup.select('.code-block, .adsbygoogle, .post-nav, .post-related, .author-bio, .comments, .ft-e81d1682, .social-share, .entry-tags'):
        tag.decompose()
        
    # Find all links and clean up spam / map internal links
    for a in soup.find_all('a'):
        href = a.get('href', '')
        # Make internal absolute links relative
        if 'intirupati.in' in href:
            parsed = urllib.parse.urlparse(href)
            path = parsed.path.strip('/')
            # Map clean post paths to /blog/slug/
            if path and not path.startswith('wp-') and not path.startswith('category') and not path.startswith('author') and not path.startswith('tag'):
                a['href'] = f"/blog/{path}/"
            elif path == '':
                a['href'] = "/"
        # If link goes to a known spam/casino site, strip the link and keep text
        spam_keywords = [
            'bet', 'casino', 'slot', 'giris', 'bahis', 'bonus', 'guncel', 'yenigiris', 
            'grandpasha', 'merit', 'exness', 'exnes', 'sonbahis', 'gameofbet', 'vdcasino', 
            'matbet', 'grandpashabet', 'enjoybet', 'romabet', 'teosbet', 'tambet', 'royalbet', 
            'vipslot', 'medusabahis', 'queenbet', 'betzula', 'celtabet', 'betcio', 'alobet', 
            'ultrabet', 'nakitbahis', 'artemisbet', 'klasbahis', 'marsbahis', 'lunabet', 
            'sheratonking', 'tophillbet', 'jokerbet', 'betparibu', 'prensbet', 'meritlimancasino', 
            'netbahis', 'norabahis', 'pumabet', 'noktabet', 'holiganbet', 'casivera', 'royalbahis'
        ]
        if any(kw in href.lower() for kw in spam_keywords):
            a.replace_with(a.text)

    # Clean up image srcs to use relative public paths
    for img in soup.find_all('img'):
        src = img.get('src', '')
        if 'wp-content/uploads/' in src:
            parts = src.split('wp-content/uploads/')
            if len(parts) > 1:
                img['src'] = f"/images/{parts[1]}"
        elif src.startswith('https://intirupati.in/wp-content/uploads/'):
            rel_img_path = src.replace('https://intirupati.in/wp-content/uploads/', '')
            img['src'] = f"/images/{rel_img_path}"

def get_hero_image(soup):
    # Check og:image meta tag
    og_image = soup.find('meta', attrs={'property': 'og:image'})
    if og_image and og_image.get('content'):
        url = og_image['content']
        if 'wp-content/uploads/' in url:
            parts = url.split('wp-content/uploads/')
            return f"/images/{parts[1]}"
    
    # Try finding first img inside entry-inner
    entry_inner = soup.find(class_='entry-inner')
    if entry_inner:
        first_img = entry_inner.find('img')
        if first_img and first_img.get('src'):
            src = first_img['src']
            if src.startswith('/images/'):
                return src
            if 'wp-content/uploads/' in src:
                parts = src.split('wp-content/uploads/')
                return f"/images/{parts[1]}"
    return None

def process_post(folder_name):
    folder_path = os.path.join(source_dir, folder_name)
    html_path = os.path.join(folder_path, 'index.html')
    if not os.path.exists(html_path):
        return None
        
    with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
        html_content = f.read()
        
    soup = BeautifulSoup(html_content, 'lxml')
    
    # Title extraction
    title = ""
    og_title = soup.find('meta', attrs={'property': 'og:title'})
    if og_title and og_title.get('content'):
        title = og_title['content']
    else:
        title_tag = soup.find('title')
        if title_tag:
            title = title_tag.text
    title = title.split(' - ')[0].split(' | ')[0].strip()
    
    # Description extraction
    description = ""
    meta_desc = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
    if meta_desc and meta_desc.get('content'):
        description = meta_desc['content'].strip()
        
    # Date extraction
    pub_date_str = "May 19 2026"
    pub_meta = soup.find('meta', attrs={'property': 'article:published_time'})
    if pub_meta and pub_meta.get('content'):
        pub_date_str = pub_meta['content']
    else:
        pub_span = soup.find(class_='published')
        if pub_span:
            pub_date_str = pub_span.text.strip()
            
    updated_date_str = None
    mod_meta = soup.find('meta', attrs={'property': 'article:modified_time'})
    if mod_meta and mod_meta.get('content'):
        updated_date_str = mod_meta['content']
        
    # Hero image
    hero_image = get_hero_image(soup)
    
    # Clean layout and spam links
    clean_html_content(soup)
    
    # Find main entry wrapper
    entry_inner = soup.find(class_='entry-inner')
    if not entry_inner:
        entry_inner = soup.find(class_='entry') or soup.find('article') or soup.find('main')
        
    if not entry_inner:
        print(f"[-] Could not find main content wrapper for: {folder_name}")
        return None
        
    # Convert to markdown
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.ignore_images = False
    h.body_width = 0
    h.unicode_snob = True
    markdown_body = h.handle(str(entry_inner))
    
    # Cleanup whitespace
    markdown_body = re.sub(r'\n{3,}', '\n\n', markdown_body).strip()
    
    # Construct frontmatter
    frontmatter = [
        "---",
        f"title: {repr(title)}",
        f"description: {repr(description)}",
        f"pubDate: {repr(pub_date_str)}"
    ]
    if updated_date_str:
        frontmatter.append(f"updatedDate: {repr(updated_date_str)}")
    if hero_image:
        frontmatter.append(f"heroImage: {repr(hero_image)}")
    frontmatter.append("---")
    frontmatter.append("")
    
    markdown_file_content = "\n".join(frontmatter) + "\n" + markdown_body
    
    dest_path = os.path.join(dest_dir, f"{folder_name}.md")
    with open(dest_path, 'w', encoding='utf-8') as out_f:
        out_f.write(markdown_file_content)
        
    print(f"[+] Converted: {folder_name} -> {folder_name}.md")
    return dest_path

def main():
    print("Starting conversion of WordPress static files to Markdown...")
    all_folders = os.listdir(source_dir)
    converted_count = 0
    
    for folder in all_folders:
        if folder in ignore_folders:
            continue
        folder_path = os.path.join(source_dir, folder)
        if not os.path.isdir(folder_path):
            continue
            
        # Run conversion
        try:
            res = process_post(folder)
            if res:
                converted_count += 1
        except Exception as e:
            print(f"[ERROR] Failed converting {folder}: {e}")
            
    print(f"\nCompleted conversion! Total files converted successfully: {converted_count}")

if __name__ == "__main__":
    main()
