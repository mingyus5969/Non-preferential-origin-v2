import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<body class="antialiased min-h-screen flex flex-col">', '<body class="antialiased min-h-screen flex flex-col overflow-x-hidden">')
html = html.replace('<main class="flex-1">', '<main class="flex-1 overflow-x-hidden">')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

