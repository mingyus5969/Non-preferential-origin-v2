import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'w-\[900px\] h-\[900px\]', 'w-80 h-80 sm:w-[900px] sm:h-[900px]', html)
html = re.sub(r'w-\[400px\] h-\[400px\]', 'w-40 h-40 sm:w-[400px] sm:h-[400px]', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

