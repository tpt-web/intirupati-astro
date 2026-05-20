import os

file_path = r"d:\intirupati backup\intirupati\intirupati-astro\src\content\blog\tools.md"
if os.path.exists(file_path):
    os.remove(file_path)
    print("Successfully deleted src/content/blog/tools.md")
else:
    print("File src/content/blog/tools.md does not exist")
