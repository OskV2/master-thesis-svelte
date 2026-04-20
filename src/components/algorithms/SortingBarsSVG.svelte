<script>
  let { array = [], comparing = [], sorted = [], width = 600, height = 300 } = $props();

  const COLORS = {
    default: '#3b82f6',
    comparing: '#f59e0b',
    sorted: '#10b981',
    text: '#f1f5f9',
  };

  let n = $derived(array.length);
  let maxVal = $derived(n > 0 ? Math.max(...array) : 1);

  let padding = 20;
  let usableWidth = $derived(width - padding * 2);
  let usableHeight = $derived(height - padding * 2);
  let gap = 2;
  let barWidth = $derived(n > 0 ? (usableWidth - gap * (n - 1)) / n : 0);

  function getBarColor(index) {
    if (sorted.includes(index)) return COLORS.sorted;
    if (comparing.includes(index)) return COLORS.comparing;
    return COLORS.default;
  }
</script>

{#if n > 0}
  <svg
    {width}
    {height}
    viewBox="0 0 {width} {height}"
    class="w-full rounded-xl bg-surface-light border border-slate-700/50"
  >
    {#each array as value, index}
      {@const barHeight = (value / maxVal) * usableHeight}
      {@const x = padding + index * (barWidth + gap)}
      {@const y = height - padding - barHeight}
      {@const color = getBarColor(index)}
      {@const isComparing = comparing.includes(index)}
      {@const isSorted = sorted.includes(index)}
      {@const textY = barHeight > 24 ? y + 18 : y - 6}

      <g>
        <!-- Bar -->
        <rect
          {x}
          {y}
          width={barWidth}
          height={barHeight}
          rx={2}
          fill={color}
          style="transition: all 0.25s ease-in-out"
        />

        <!-- Glow when comparing -->
        {#if isComparing}
          <rect
            x={x - 2}
            y={y - 2}
            width={barWidth + 4}
            height={barHeight + 4}
            rx={4}
            fill="none"
            stroke={COLORS.comparing}
            stroke-width={2}
            opacity={0.8}
          />
        {/if}

        <!-- Dot when sorted -->
        {#if isSorted}
          <circle
            cx={x + barWidth / 2}
            cy={height - padding + 12}
            r={4}
            fill={COLORS.sorted}
          />
        {/if}

        <!-- Value label -->
        <text
          x={x + barWidth / 2}
          y={textY}
          text-anchor="middle"
          font-size={Math.min(barWidth * 0.5, 14)}
          font-family="'JetBrains Mono', monospace"
          font-weight="600"
          fill={COLORS.text}
          style="transition: all 0.25s ease-in-out"
        >
          {value}
        </text>
      </g>
    {/each}
  </svg>
{/if}
