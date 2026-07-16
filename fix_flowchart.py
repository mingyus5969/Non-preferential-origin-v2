import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the header in the flowchart section
html = html.replace('<div class="w-full flex items-center justify-between mb-8 min-w-[1000px]">', '<div class="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">')

# Wrap SVG in a scrollable div instead of having the whole glass-panel scroll
# Currently: <div class="glass-panel p-6 sm:p-10 block overflow-x-auto w-full fade-in">
html = html.replace('<div class="glass-panel p-6 sm:p-10 block overflow-x-auto w-full fade-in">', '<div class="glass-panel p-6 sm:p-10 block w-full fade-in">')

# We need to wrap the svg in a div
svg_start = '<svg id="origin-flowchart"'
svg_wrapper = '<div class="w-full overflow-x-auto pb-4">\n          <svg id="origin-flowchart"'

html = html.replace(svg_start, svg_wrapper)

# Then we need to add the closing div after </svg>
html = html.replace('</svg>', '</svg>\n        </div>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
