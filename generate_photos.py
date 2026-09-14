from pathlib import Path
import re

PHOTO_DIR = Path("images/photography")
HTML_FILE = Path("other.html")

photos = []

for file in PHOTO_DIR.iterdir():
    if file.is_file() and re.fullmatch(r"photo-\d+\.jpg", file.name, re.IGNORECASE):
        photos.append(file.name)

photos.sort(
    key=lambda name: int(re.search(r"(\d+)", name).group(1))
)

photo_html = "\n".join(
    f'''                    <button class="photo-item" type="button">
                        <img
                            src="images/photography/{photo}"
                            alt="Photography {i + 1}"
                            loading="lazy">
                    </button>'''
    for i, photo in enumerate(photos)
)

html = HTML_FILE.read_text(encoding="utf-8")

start_marker = """                <div
                    class="photo-grid"
                    id="photoGrid">

                    <!-- Photos are generated automatically during deployment -->

                </div>"""

replacement = f"""                <div
                    class="photo-grid"
                    id="photoGrid">

{photo_html}

                </div>"""

if start_marker not in html:
    raise RuntimeError("Could not find the photo grid placeholder in other.html")

html = html.replace(start_marker, replacement)

HTML_FILE.write_text(html, encoding="utf-8")

print(f"Added {len(photos)} photographs.")