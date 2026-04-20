<script>
  let { step, height = 450 } = $props();

  const COLORS = {
    node: '#3b82f6',
    highlighted: '#f59e0b',
    path: '#6366f1',
    found: '#10b981',
    edge: '#475569',
    text: '#f1f5f9',
  };

  const NODE_RADIUS = 22;

  let tree = $derived(step?.tree ?? []);
  let highlighted = $derived(step?.highlighted ?? []);
  let path = $derived(step?.path ?? []);

  let maxDepth = $derived(tree.length > 0 ? Math.max(...tree.map((n) => n.depth)) : 0);
  let totalNodes = $derived(tree.length);

  let paddingX = 40;
  let paddingY = 50;
  let width = $derived(Math.max(totalNodes * (NODE_RADIUS * 2 + 10) + paddingX * 2, 600));
  let levelHeight = $derived(Math.min((height - paddingY * 2) / (maxDepth + 1), 80));
  let xStep = $derived((width - paddingX * 2) / (totalNodes + 1));

  let nodePositions = $derived.by(() => {
    const pos = {};
    tree.forEach((node) => {
      const x = paddingX + (node.inOrderPos + 1) * xStep;
      const y = paddingY + node.depth * levelHeight + NODE_RADIUS;
      pos[node.id] = { x, y, ...node };
    });
    return pos;
  });

  function getNodeColor(nodeId) {
    if (highlighted.includes(nodeId)) {
      if (step.type.includes('place') || step.type.includes('found') || step.type.includes('done')) {
        return COLORS.found;
      }
      return COLORS.highlighted;
    }
    if (path.includes(nodeId)) return COLORS.path;
    return COLORS.node;
  }

  let edges = $derived.by(() => {
    const result = [];
    tree.forEach((node) => {
      const from = nodePositions[node.id];
      if (node.leftId != null && nodePositions[node.leftId]) {
        result.push({ from, to: nodePositions[node.leftId], key: `${node.id}-${node.leftId}` });
      }
      if (node.rightId != null && nodePositions[node.rightId]) {
        result.push({ from, to: nodePositions[node.rightId], key: `${node.id}-${node.rightId}` });
      }
    });
    return result;
  });
</script>

{#if step}
  {#if tree.length === 0}
    <svg width="100%" {height} viewBox="0 0 600 {height}"
      class="rounded-xl bg-surface-light border border-slate-700/50">
      <text x={300} y={height / 2} text-anchor="middle"
        fill="#64748b" font-size={14} font-family="'JetBrains Mono', monospace">
        Drzewo puste
      </text>
    </svg>
  {:else}
    <svg
      width="100%"
      {height}
      viewBox="0 0 {width} {height}"
      class="rounded-xl bg-surface-light border border-slate-700/50"
    >
      <!-- Edges -->
      {#each edges as edge (edge.key)}
        <line
          x1={edge.from.x}
          y1={edge.from.y}
          x2={edge.to.x}
          y2={edge.to.y}
          stroke={COLORS.edge}
          stroke-width={2}
          style="transition: all 0.3s ease-in-out"
        />
      {/each}

      <!-- Nodes -->
      {#each tree as node (node.id)}
        {@const pos = nodePositions[node.id]}
        {@const color = getNodeColor(node.id)}
        <g>
          <circle
            cx={pos.x}
            cy={pos.y}
            r={NODE_RADIUS}
            fill={color}
            stroke={highlighted.includes(node.id) ? COLORS.highlighted : 'transparent'}
            stroke-width={highlighted.includes(node.id) ? 3 : 0}
            style="transition: all 0.3s ease-in-out"
          />
          <text
            x={pos.x}
            y={pos.y + 5}
            text-anchor="middle"
            font-size={13}
            font-family="'JetBrains Mono', monospace"
            font-weight="700"
            fill={COLORS.text}
            style="transition: all 0.3s ease-in-out"
          >
            {node.value}
          </text>
        </g>
      {/each}
    </svg>
  {/if}
{/if}
