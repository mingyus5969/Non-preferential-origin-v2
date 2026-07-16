import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace <script src="https://cdn.tailwindcss.com... up to </style>
html = re.sub(
    r'<script src="https://cdn\.tailwindcss\.com.*?</style>',
    '<link rel="stylesheet" href="/src/style.css">\n<script type="module" src="/src/main.js"></script>',
    html,
    flags=re.DOTALL
)

# Remove the inline script block at the bottom
html = re.sub(
    r'<script>.*?</script></body>',
    '</body>',
    html,
    flags=re.DOTALL
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
