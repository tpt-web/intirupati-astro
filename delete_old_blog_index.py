import os

file_path = r"d:\intirupati backup\intirupati\intirupati-astro\src\pages\blog\index.astro"
if os.path.exists(file_path):
    os.remove(file_path)
    print("Successfully deleted src/pages/blog/index.astro")
else:
    print("File src/pages/blog/index.astro does not exist")
