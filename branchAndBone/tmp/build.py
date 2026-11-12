#!/usr/bin/env python3
"""build.py -- story YAML files + template.html.j2 -> one HTML page per YAML file, linked by tabs.
usage: python build.py story.yaml [backstory.yaml ...]        (pip install jinja2 markdown pyyaml)
The first file becomes index.html; the others become <name>.html unless they set `output:`.
Each file's `tab:` is its tab label (default: its title). Tab order follows the command line.
Text files may be .md (converted) or .html (used as is). Missing media is reported and the scene
falls back to its 'fallback' CSS background, so the story always builds."""
import sys
from pathlib import Path
import yaml, markdown
from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup, escape

def load(yaml_file, first):
    path = Path(yaml_file).resolve()
    here = path.parent
    story = yaml.safe_load(open(path, encoding='utf-8'))
    story.setdefault('output', 'index.html' if first else path.stem + '.html')
    story.setdefault('tab', story.get('title', path.stem))
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
                    else: print(f'  MISSING media: {m[key]} ({path.name}, scene "{sc["id"]}" uses its fallback background)')
        sc['has_ngl'] = any(m.get('ngl') for m in sc['medias'])
        for s in sc.get('steps') or []:
            s['html'] = text_of(s['text'])
    story['uses_ngl'] = any(sc['has_ngl'] for sc in story['scenes'])
    return story

def main(files):
    outdir = Path(files[0]).resolve().parent
    stories = [load(f, i == 0) for i, f in enumerate(files)]
    tabs = [{'label': s['tab'], 'href': s['output']} for s in stories]
    env = Environment(loader=FileSystemLoader(str(outdir)), autoescape=True)
    # |br: escape the text, then turn each newline into <br>, so headings and notes can have line breaks
    env.filters['br'] = lambda s: Markup(escape(s).replace('\n', Markup('<br>')))
    template = env.get_template('template.html.j2')
    for s in stories:
        (outdir / s['output']).write_text(template.render(**s, tabs=tabs, current=s['output']), encoding='utf-8')
        print(f'wrote {outdir / s["output"]} ({len(s["scenes"])} scenes)')

if __name__ == '__main__':
    main(sys.argv[1:] or ['story.yaml'])
