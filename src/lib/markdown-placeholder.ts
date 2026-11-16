import { defineMdastPlugin } from 'satteri';

/**
 * Destaca marcadores [PREENCHER: …] também dentro dos textos em Markdown
 * (publicações), do mesmo jeito que no restante do site.
 */
const pattern = /\[PREENCHER:[^\]]*\]/g;

export const placeholderPlugin = defineMdastPlugin({
  name: 'destacar-preencher',
  text(node, ctx) {
    if (!node.value.includes('[PREENCHER:')) return;
    const parts: { type: string; value?: string; data?: object; children?: object[] }[] = [];
    let last = 0;
    for (const match of node.value.matchAll(pattern)) {
      const start = match.index;
      if (start > last) parts.push({ type: 'text', value: node.value.slice(last, start) });
      parts.push({
        type: 'placeholder',
        data: { hName: 'mark', hProperties: { className: ['placeholder'] } },
        children: [{ type: 'text', value: match[0] }],
      });
      last = start + match[0].length;
    }
    if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) });
    if (last > 0) ctx.replaceNode(node, parts as Parameters<typeof ctx.replaceNode>[1]);
  },
});
