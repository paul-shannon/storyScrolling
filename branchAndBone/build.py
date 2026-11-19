#!/usr/bin/env python3
"""build.py -- story YAML files + template.html.j2 -> one HTML page per YAML file, linked by tabs.
usage: python build.py site.yaml                        (pip install jinja2 markdown pyyaml)
       python build.py story.yaml [backstory.yaml ...]  (older form: just a list of stories)

site.yaml names the pages of the site, paths relative to the folder holding site.yaml:
    tabs:                       # the main stories: one tab each, in this order; the first is index.html
      - story.yaml
      - backstory.yaml
    background:                 # deep-dive pages, no tab: reached from a scene's `more:` link
      - background/oec.yaml
A background entry is either a .yaml story (any layouts and media) or, simplest, one bare .html or .md text file:
the build turns it into a plain reading page, titled from its first heading (images go in with ordinary <img> tags).
A scene links to a background page with  `more: oec-furtherDiscussion`  or
`more: {page: oec-furtherDiscussion, label: "Further discussion", at: some-scene}`
(the page id is the file's `id:`, or its file name without its extension). The page gets a "back" link to the scene
that sent the reader there. Optionally the scene can put a short lead-in at the top of that page:
`lede: "Some context."`, or `lede: {label: "Why this matters", text: "..."}`, or `claim: "..."`, which is a lede
labelled "The claim" (a page's own top-level `lede:` / `claim:` takes precedence). Without any of these, no lead-in is shown.

All paths inside the YAML files (text:, img:, video: ...) are relative to the folder holding site.yaml, and all
pages are written there, wherever the YAML files live. Each file's `tab:` is its tab label (default: its title).
Text files may be .md (converted) or .html (used as is). Missing media is reported and the scene
falls back to its 'fallback' CSS background, so the story always builds."""
import os, re, sys
from pathlib import Path
import yaml, markdown
from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup, escape

TEXT_SUFFIXES = ('.html', '.htm', '.md')

def lede_of(v, label=None):
    """A lead-in for the top of a background page: a string, or {label:, text:}; None when there is none."""
    if not v: return None
    if isinstance(v, dict): return {'label': v.get('label'), 'text': str(v.get('text', ''))}
    return {'label': label, 'text': str(v)}

def text_page(path, root):
    """A bare text file as a one-scene reading page, titled from its first heading."""
    if not path.exists(): sys.exit(f'build.py: {path} is listed in the site file but does not exist')
    raw = path.read_text(encoding='utf-8')
    m = re.search(r'<h[1-6][^>]*>(.*?)</h[1-6]>', raw, re.S | re.I) or re.search(r'^#+\s*(.+)$', raw, re.M)
    title = re.sub(r'<[^>]+>', '', m.group(1)).strip() if m else path.stem
    return {'title': title, 'id': path.stem,
            'scenes': [{'layout': 'reading', 'id': 'text', 'steps': [{'text': os.path.relpath(path, root)}]}]}

def load(yaml_file, root, first, background=False):
    path = Path(yaml_file).resolve()
    here = root                                   # every asset path is relative to the site folder
    story = text_page(path, root) if path.suffix in TEXT_SUFFIXES else yaml.safe_load(open(path, encoding='utf-8'))
    story.setdefault('output', 'index.html' if first else path.stem + '.html')
    if (root / story['output']).resolve() == path:
        sys.exit(f'build.py: {path} would be overwritten by its own page; keep text sources in a subfolder such as text/')
    story.setdefault('tab', story.get('title', path.stem))
    story.setdefault('id', path.stem)
    story['background'] = background
    story['lede'] = lede_of(story.get('lede')) or lede_of(story.get('claim'), 'The claim')
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
        for key in ('lead', 'trail', 'gap'):
            if key in sc:
                sc['style'] += '; --%s: %svh' % (key, sc[key])
        raw = sc.get('media') or {}
        sc['medias'] = raw if isinstance(raw, list) else [raw]      # a scene may hold one item or a list
        for m in sc['medias']:
            m.setdefault('alt', '')
            if m.get('tableau'):                  # a stage of pictures: same pinned-stage plumbing as the molecules
                m['ngl'] = {'kind': 'tableau', **m.pop('tableau')}
                for it in m['ngl'].get('items', []):
                    if it.get('img') and not exists(it['img']):
                        print(f'  MISSING media: {it["img"]} ({path.name}, scene "{sc["id"]}", item "{it["id"]}" shows a placeholder box)')
            m['ok'] = bool(m.get('youtube') or m.get('ngl'))
            for key in ('video', 'img'):
                if m.get(key):
                    if exists(m[key]): m['ok'] = True
                    else: print(f'  MISSING media: {m[key]} ({path.name}, scene "{sc["id"]}" uses its fallback background)')
        sc['has_ngl'] = any(m.get('ngl') for m in sc['medias'])
        for s in sc.get('steps') or []:
            s['html'] = text_of(s['text'])
    kinds = [(m['ngl'].get('kind') or 'molecule') for sc in story['scenes'] for m in sc['medias'] if m.get('ngl')]
    story['uses_stage'] = bool(kinds)                                  # any pinned stage at all
    story['uses_ngl'] = any(k in ('molecule', 'etc') for k in kinds)   # only these need the NGL library itself
    story['uses_etc'] = 'etc' in kinds
    story['uses_tableau'] = 'tableau' in kinds
    return story

def read_site(args):
    """-> (root folder, [main story files], [background files])"""
    first = Path(args[0]).resolve()
    data = yaml.safe_load(open(first, encoding='utf-8')) if len(args) == 1 else None
    if isinstance(data, dict) and ('tabs' in data or 'background' in data):     # a site manifest
        root = first.parent
        return root, [root / f for f in data.get('tabs', [])], [root / f for f in data.get('background', [])]
    return first.parent, [Path(f).resolve() for f in args], []                     # the older form

def link_pages(stories):
    """Resolve every scene's `more:` to a link, and tell each target page who sent the reader (for its back link)."""
    pages = {}
    for s in stories:
        if s['id'] in pages: sys.exit(f'build.py: two pages have the id "{s["id"]}" (set `id:` in one of them)')
        pages[s['id']] = s
    for s in stories:
        for sc in s['scenes']:
            more = sc.get('more')
            if not more: continue
            more = {'page': more} if isinstance(more, str) else dict(more)
            target = pages.get(more.get('page'))
            if not target:
                sys.exit(f'build.py: scene "{sc["id"]}" in {s["output"]} links to unknown page "{more.get("page")}" (background pages must be listed in site.yaml) '
                         f'(known: {", ".join(pages)})')
            sc['more'] = {'href': target['output'] + ('#' + more['at'] if more.get('at') else ''),
                          'label': more.get('label') or 'Go deeper'}
            target.setdefault('referrers', []).append(
                {'href': f'{s["output"]}#{sc["id"]}', 'label': s['tab'],
                 'lede': lede_of(sc.get('lede')) or lede_of(sc.get('claim'), 'The claim')})
    for s in stories:
        refs = s.get('referrers', [])
        if s['background'] and not refs:
            print(f'  NOTE: background page "{s["id"]}" ({s["output"]}) is not linked from any scene')
        if refs:
            s['back'] = {'href': refs[0]['href'], 'label': f'Back to {refs[0]["label"]}'}
            s['lede'] = s['lede'] or refs[0]['lede']

def main(args):
    root, tab_files, background_files = read_site(args)
    stories = [load(f, root, i == 0) for i, f in enumerate(tab_files)]
    stories += [load(f, root, False, background=True) for f in background_files]
    link_pages(stories)
    tabs = [{'label': s['tab'], 'href': s['output']} for s in stories if not s['background']]
    env = Environment(loader=FileSystemLoader(str(root)), autoescape=True)
    # |br: escape the text, then turn each newline into <br>, so headings and notes can have line breaks
    env.filters['br'] = lambda s: Markup(escape(s).replace('\n', Markup('<br>')))
    template = env.get_template('template.html.j2')
    for s in stories:
        (root / s['output']).write_text(template.render(**s, tabs=tabs, current=s['output']), encoding='utf-8')
        print(f'wrote {root / s["output"]} ({len(s["scenes"])} scenes{", background" if s["background"] else ""})')

if __name__ == '__main__':
    main(sys.argv[1:] or ['site.yaml'])
