#!/usr/bin/env python3
"""Generate ora/profiles/*.md from the ORA CSV export."""

import csv
import os
import re
import sys

CSV_PATH = os.path.join(os.path.dirname(__file__), '../sandbox/Elements-All Elements & All Fields.csv')
OUT_DIR = os.path.join(os.path.dirname(__file__), '../ora/profiles')

READY_VALUES = {'checked', 'yes', 'true', 'x'}


def slugify(name: str) -> str:
    name = name.lower().strip()
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[\s_]+', '-', name)
    name = re.sub(r'-+', '-', name)
    return name.strip('-')


def split_tags(value: str) -> list[str]:
    if not value.strip():
        return []
    # Use csv.reader to handle quoted values like "Policy, Planning & Law"
    import io
    row = next(csv.reader(io.StringIO(value)))
    return [t.strip() for t in row if t.strip()]


def clean(value: str) -> str:
    return ''.join(c for c in value if c >= ' ' or c == '\n')


def yaml_str(value: str) -> str:
    value = clean(value).strip()
    if not value:
        return '""'
    # Quote if contains special yaml chars
    if any(c in value for c in [':', '#', '[', ']', '{', '}', ',', '&', '*', '?', '|', '-', '<', '>', '=', '!', '%', '@', '`', '"', "'"]):
        escaped = value.replace('"', '\\"')
        return f'"{escaped}"'
    return value


def yaml_list(items: list[str]) -> str:
    if not items:
        return ' []'
    lines = ['']
    for item in items:
        escaped = clean(item).replace('"', '\\"')
        lines.append(f'  - "{escaped}"')
    return '\n'.join(lines)


def build_frontmatter(row: dict) -> str:
    featured = row.get('Ready to share with Partners?', '').strip().lower() in READY_VALUES
    lines = ['---']
    lines.append(f'title: {yaml_str(row["Name/Label"])}')

    website = row.get('Website', '').strip()
    if website and website.lower() not in ('', 'not-found'):
        lines.append(f'website: {yaml_str(website)}')

    email = row.get('Email', '').strip()
    if email:
        lines.append(f'email: {yaml_str(email)}')

    city = row.get('City, State', '').strip()
    if city:
        lines.append(f'city: {yaml_str(city)}')

    country = row.get('Country', '').strip()
    if country:
        lines.append(f'country: {yaml_str(country)}')

    region = row.get('Operating Region(s)', '').strip()
    if region:
        lines.append(f'region: {yaml_str(region)}')

    scale = row.get('Scale', '').strip()
    if scale:
        lines.append(f'scale: {yaml_str(scale)}')

    org_type = row.get('Individual/Organization', '').strip()
    if org_type:
        lines.append(f'org_type: {yaml_str(org_type)}')

    subtype = row.get('Actor Sub-Type(s)', '').strip()
    if subtype:
        lines.append(f'subtype: {yaml_str(subtype)}')

    activities = split_tags(row.get('Activities', ''))
    lines.append(f'activities:{yaml_list(activities)}')

    system_focus = split_tags(row.get('System focus', ''))
    lines.append(f'system_focus:{yaml_list(system_focus)}')

    tags_approach = split_tags(row.get('Tags: Field/Approach', ''))
    lines.append(f'tags_approach:{yaml_list(tags_approach)}')

    tags_issues = split_tags(row.get('Tags: Issues', ''))
    lines.append(f'tags_issues:{yaml_list(tags_issues)}')

    keywords = split_tags(row.get('Keywords', ''))
    lines.append(f'keywords:{yaml_list(keywords)}')

    values_field = split_tags(row.get('Values', ''))
    if values_field:
        lines.append(f'values:{yaml_list(values_field)}')

    inspirations = split_tags(row.get('Inspirations & Influences (People)', ''))
    if inspirations:
        lines.append(f'inspirations:{yaml_list(inspirations)}')

    tools = split_tags(row.get('Tools & Practices', ''))
    if tools:
        lines.append(f'tools:{yaml_list(tools)}')

    lines.append(f'featured: {"true" if featured else "false"}')
    lines.append('---')
    return '\n'.join(lines)


def build_body(row: dict) -> str:
    parts = []

    description = clean(row.get('Description', '')).strip()
    if description:
        parts.append(description)

    paradigmatic = clean(row.get('Paradigmatic?', '')).strip()
    if paradigmatic:
        parts.append(f'## Paradigmatic\n\n{paradigmatic}')

    integrated = clean(row.get('Integrated?', '')).strip()
    if integrated:
        parts.append(f'## Integrated\n\n{integrated}')

    pragmatic = clean(row.get('Pragmatic?', '')).strip()
    if pragmatic:
        parts.append(f'## Pragmatic\n\n{pragmatic}')

    publications = clean(row.get('Key Publications', '')).strip()
    if publications:
        parts.append(f'## Key Publications\n\n{publications}')

    notes = clean(row.get('Additional Notes', '')).strip()
    if notes:
        parts.append(f'## Additional Notes\n\n{notes}')

    return '\n\n'.join(parts)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    with open(CSV_PATH, encoding='utf-8-sig') as f:
        rows = list(csv.DictReader(f))

    seen_slugs: dict[str, int] = {}
    generated = 0

    for row in rows:
        name = row.get('Name/Label', '').strip()
        if not name:
            continue

        base_slug = slugify(name)
        if base_slug in seen_slugs:
            seen_slugs[base_slug] += 1
            slug = f'{base_slug}-{seen_slugs[base_slug]}'
        else:
            seen_slugs[base_slug] = 1
            slug = base_slug

        frontmatter = build_frontmatter(row)
        body = build_body(row)
        content = frontmatter + '\n\n' + body + '\n' if body else frontmatter + '\n'

        out_path = os.path.join(OUT_DIR, f'{slug}.md')
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(content)

        featured = row.get('Ready to share with Partners?', '').strip().lower() in READY_VALUES
        print(f'{"[featured]" if featured else "[stub]   "} {slug}.md')
        generated += 1

    print(f'\n{generated} files written to {OUT_DIR}')


if __name__ == '__main__':
    main()
