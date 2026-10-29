/**
 * Wraps each "## Heading" section of a case-study body in the card markup
 * the site uses: <div class="cs-sec"><h4 id="<slug>-<heading>">Heading</h4>...</div>.
 * Heading ids are prefixed with the file's slug so they stay unique when all
 * studies render on the homepage.
 */
const toText = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(toText).join('');

const slugify = (s) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function rehypeCaseStudySections() {
  return (tree, file) => {
    const path = String(file.path ?? file.history?.[0] ?? '');
    const prefix = (path.split('/').pop() ?? '').replace(/\.md$/, '');
    const out = [];
    let current = null;
    for (const node of tree.children) {
      if (node.type === 'element' && node.tagName === 'h2') {
        const id = [prefix, slugify(toText(node))].filter(Boolean).join('-');
        current = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['cs-sec'] },
          children: [{ ...node, tagName: 'h4', properties: { ...node.properties, id } }],
        };
        out.push(current);
      } else if (current) {
        if (node.type === 'text' && !node.value.trim()) continue;
        current.children.push(node);
      } else {
        out.push(node);
      }
    }
    tree.children = out;
  };
}
