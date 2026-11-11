#!/usr/bin/env python3
"""build.py -- story.yaml + template.html.j2 -> index.html
usage: python build.py story.yaml        (pip install jinja2 markdown pyyaml)
Text files may be .md (converted) or .html (used as is). Missing media is reported and the scene
falls back to its 'fallback' CSS background, so the story always builds."""
import sys
from pathlib import Path
import yaml, markdown
from jinja2 import Environment, FileSystemLoader

def main(yaml_file):
    here = Path(yaml_file).resolve().parent
    story = yaml.safe_load(open(yaml_file, encoding='utf-8'))
    md = markdown.Markdown(extensions=['nl2br'])
    exists = lambda ref: ref.startswith('http') or (here / ref).exists()

    def text_of(ref):
        p = here / ref
        if not p.exists():
            print(f'  MISSING text: {ref}'); return f'<p><em>missing text: {ref}</em></p>'
        raw = p.read_text(encoding='utf-8')
        return md.reset().convert(raw) if p.suffix == '.md' else raw

    for i, sc in enumerate(story['scenes']):
        sc.setdefault('id', f'scene{i + 1}')
        sc['style'] = '--fallback: %s' % sc.get('fallback', '#1f2d26')
        raw = sc.get('media') or {}
        sc['medias'] = raw if isinstance(raw, list) else [raw]      # a scene may hold one item or a list
        for m in sc['medias']:
            m.setdefault('alt', '')
            m['ok'] = bool(m.get('youtube') or m.get('ngl'))
            for key in ('video', 'img'):
                if m.get(key):
                    if exists(m[key]): m['ok'] = True
                    else: print(f'  MISSING media: {m[key]} (scene "{sc["id"]}" uses its fallback background)')
        for s in sc.get('steps') or []:
            s['html'] = text_of(s['text'])
    story['uses_ngl'] = any(m.get('ngl') for sc in story['scenes'] for m in sc['medias'])
    env = Environment(loader=FileSystemLoader(str(here)), autoescape=True)
    out = env.get_template('template.html.j2').render(**story)
    (here / 'index.html').write_text(out, encoding='utf-8')
    print(f'wrote {here / "index.html"} ({len(story["scenes"])} scenes)')

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'story.yaml')
