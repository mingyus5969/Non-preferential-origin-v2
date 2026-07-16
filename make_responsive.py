import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix blobs
html = re.sub(r'w-\[800px\] h-\[800px\]', 'w-72 h-72 sm:w-[800px] sm:h-[800px]', html)
html = re.sub(r'w-\[600px\] h-\[600px\]', 'w-64 h-64 sm:w-[600px] sm:h-[600px]', html)
html = re.sub(r'w-\[500px\] h-\[500px\]', 'w-48 h-48 sm:w-[500px] sm:h-[500px]', html)
html = re.sub(r'w-\[700px\] h-\[700px\]', 'w-56 h-56 sm:w-[700px] sm:h-[700px]', html)

# Fix cards
html = html.replace('flex flex-row items-center gap-4 hover-lift cursor-default group/card', 'flex flex-col sm:flex-row items-start sm:items-center gap-4 hover-lift cursor-default group/card')

# Add overflow-x-auto to table wrappers
html = html.replace('class="rounded-2xl border border-slate-200 overflow-hidden shadow-sm"', 'class="rounded-2xl border border-slate-200 overflow-x-auto overflow-y-hidden shadow-sm"')

# Make sure laws-grid is responsive. It is already: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

