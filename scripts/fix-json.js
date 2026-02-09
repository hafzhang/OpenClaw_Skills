import re

with open('src/data/tutorials.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the specific issue: missing comma after the content field that ends with 'zod.dev/)'
# Find the pattern where the content field ending is followed by "category" without a comma
pattern = r'(- \[Zod 文档\]\(https://zod\.dev/\)")\n    "category": "development"'
replacement = r'\1",\n    "category": "development"'

content = re.sub(pattern, replacement, content)

with open('src/data/tutorials.json', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed JSON syntax error')
