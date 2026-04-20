<script>
  import { onMount, tick } from 'svelte';

  let { array = [], comparing = [], sorted = [], height = 300 } = $props();

  let containerEl = $state(null);
  let canvasEl = $state(null);
  let width = $state(0);

  const COLORS = {
    default: '#3b82f6',
    comparing: '#f59e0b',
    sorted: '#10b981',
    text: '#f1f5f9',
    background: '#1e293b',
  };

  function getBarColor(index) {
    if (sorted.includes(index)) return COLORS.sorted;
    if (comparing.includes(index)) return COLORS.comparing;
    return COLORS.default;
  }

  function draw() {
    if (!canvasEl || width === 0) return;
    const ctx = canvasEl.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvasEl.width = width * dpr;
    canvasEl.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, width, height);

    const n = array.length;
    if (n === 0) return;

    const maxVal = Math.max(...array);
    const padding = 20;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;
    const gap = 2;
    const barWidth = (usableWidth - gap * (n - 1)) / n;

    array.forEach((value, index) => {
      const barHeight = (value / maxVal) * usableHeight;
      const x = padding + index * (barWidth + gap);
      const y = height - padding - barHeight;
      const color = getBarColor(index);
      const isComparing = comparing.includes(index);
      const isSorted = sorted.includes(index);

      // Glow
      if (isComparing) {
        ctx.strokeStyle = COLORS.comparing;
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 2, y - 2, barWidth + 4, barHeight + 4);
      }

      // Bar
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();

      // Dot
      if (isSorted) {
        ctx.fillStyle = COLORS.sorted;
        ctx.beginPath();
        ctx.arc(x + barWidth / 2, height - padding + 12, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Text
      const fontSize = Math.min(barWidth * 0.5, 14);
      ctx.fillStyle = COLORS.text;
      ctx.font = `600 ${fontSize}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      const textY = barHeight > 24 ? y + 16 : y - 6;
      ctx.fillText(String(value), x + barWidth / 2, textY);
    });
  }

  onMount(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
      }
    });
    if (containerEl) {
      observer.observe(containerEl);
      width = containerEl.getBoundingClientRect().width;
    }
    return () => observer.disconnect();
  });

  $effect(() => {
    // Re-draw whenever any input changes
    array; comparing; sorted; width;
    draw();
  });
</script>

<div bind:this={containerEl} class="rounded-xl overflow-hidden border border-slate-700/50">
  <canvas
    bind:this={canvasEl}
    style="width: 100%; height: {height}px;"
  ></canvas>
</div>
