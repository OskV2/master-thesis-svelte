<script>
  let { step, height = 350 } = $props();

  const COLORS = {
    default: '#334155',
    textChar: '#f1f5f9',
    comparing: '#f59e0b',
    match: '#10b981',
    mismatch: '#ef4444',
    found: '#10b981',
    patternBg: '#1e3a5f',
    lpsBg: '#1e293b',
  };

  const CELL_SIZE = 32;
  const CELL_GAP = 2;
  const FONT_SIZE = 13;

  let isLpsPhase = $derived(step?.type?.startsWith('lps'));
  let isSearchPhase = $derived(step?.type?.startsWith('search'));

  let text = $derived(step?.text ?? '');
  let pattern = $derived(step?.pattern ?? '');
  let lps = $derived(step?.lps ?? []);

  let totalChars = $derived(Math.max(text.length, pattern.length, 1));
  let width = $derived(Math.max(totalChars * (CELL_SIZE + CELL_GAP) + 60, 400));

  // Search phase helpers
  let textIndex = $derived(step?.textIndex ?? 0);
  let patternIndex = $derived(step?.patternIndex ?? 0);
  let matches = $derived(step?.matches ?? []);
  let patternOffset = $derived(textIndex - patternIndex);

  function getTextCharColor(i) {
    for (const mStart of matches) {
      if (i >= mStart && i < mStart + pattern.length) return COLORS.found;
    }
    if (i === textIndex) return COLORS.comparing;
    return COLORS.default;
  }

  function getPatternCharColor(j) {
    if (j === patternIndex && step?.type === 'search-compare') return COLORS.comparing;
    if (j === patternIndex && step?.type === 'search-match') return COLORS.match;
    if (j < patternIndex) return '#1a4a2e';
    return COLORS.patternBg;
  }

  function getLpsCharBg(i) {
    const isActive = step?.i === i;
    const isLen = step?.len === i;
    if (isActive && isLen) return COLORS.found;
    if (isActive) return COLORS.comparing;
    if (isLen) return COLORS.patternBg;
    return COLORS.default;
  }
</script>

{#if step}
  {#if isLpsPhase}
    <svg
      width="100%"
      {height}
      viewBox="0 0 {width} {height}"
      class="rounded-xl bg-surface-light border border-slate-700/50"
    >
      <text x={20} y={30} fill={COLORS.textChar} font-size={14} font-family="'JetBrains Mono', monospace" font-weight="600">
        Budowanie tablicy LPS
      </text>

      {#each pattern.split('') as char, i}
        {@const x = 20 + i * (CELL_SIZE + CELL_GAP)}
        <g>
          <rect
            {x} y={50} width={CELL_SIZE} height={CELL_SIZE} rx={4}
            fill={getLpsCharBg(i)}
            style="transition: fill 0.2s ease-in-out"
          />
          <text x={x + CELL_SIZE / 2} y={50 + CELL_SIZE / 2 + 5} text-anchor="middle"
            font-size={FONT_SIZE} font-family="'JetBrains Mono', monospace" font-weight="600" fill={COLORS.textChar}>
            {char}
          </text>
          <text x={x + CELL_SIZE / 2} y={48} text-anchor="middle"
            font-size={9} font-family="'JetBrains Mono', monospace" fill="#64748b">
            {i}
          </text>
        </g>
      {/each}

      <text x={20} y={115} fill="#64748b" font-size={11} font-family="'JetBrains Mono', monospace">
        LPS:
      </text>
      {#each lps as val, i}
        {@const x = 20 + i * (CELL_SIZE + CELL_GAP)}
        <g>
          <rect {x} y={125} width={CELL_SIZE} height={24} rx={3} fill={COLORS.lpsBg} stroke="#475569" stroke-width={1} />
          <text x={x + CELL_SIZE / 2} y={141} text-anchor="middle"
            font-size={11} font-family="'JetBrains Mono', monospace" font-weight="600" fill="#94a3b8">
            {val}
          </text>
        </g>
      {/each}
    </svg>
  {:else}
    <svg
      width="100%"
      {height}
      viewBox="0 0 {width} {height}"
      class="rounded-xl bg-surface-light border border-slate-700/50"
    >
      <text x={20} y={30} fill={COLORS.textChar} font-size={14} font-family="'JetBrains Mono', monospace" font-weight="600">
        Wyszukiwanie wzorca
      </text>

      <!-- Text row -->
      <text x={20} y={52} fill="#64748b" font-size={10} font-family="'JetBrains Mono', monospace">
        Tekst:
      </text>
      {#each text.split('') as char, i}
        {@const x = 20 + i * (CELL_SIZE + CELL_GAP)}
        <g>
          <rect
            {x} y={58} width={CELL_SIZE} height={CELL_SIZE} rx={4}
            fill={getTextCharColor(i)}
            style="transition: fill 0.2s ease-in-out"
          />
          <text x={x + CELL_SIZE / 2} y={58 + CELL_SIZE / 2 + 5} text-anchor="middle"
            font-size={FONT_SIZE} font-family="'JetBrains Mono', monospace" font-weight="600" fill={COLORS.textChar}>
            {char}
          </text>
          <text x={x + CELL_SIZE / 2} y={56} text-anchor="middle"
            font-size={9} font-family="'JetBrains Mono', monospace" fill="#64748b">
            {i}
          </text>
        </g>
      {/each}

      <!-- Pattern row -->
      <text x={20} y={115} fill="#64748b" font-size={10} font-family="'JetBrains Mono', monospace">
        Wzorzec:
      </text>
      {#each pattern.split('') as char, j}
        {@const x = 20 + (patternOffset + j) * (CELL_SIZE + CELL_GAP)}
        {#if x >= 0}
          <g>
            <rect
              {x} y={120} width={CELL_SIZE} height={CELL_SIZE} rx={4}
              fill={getPatternCharColor(j)}
              style="transition: fill 0.2s ease-in-out"
            />
            <text x={x + CELL_SIZE / 2} y={120 + CELL_SIZE / 2 + 5} text-anchor="middle"
              font-size={FONT_SIZE} font-family="'JetBrains Mono', monospace" font-weight="600" fill={COLORS.textChar}>
              {char}
            </text>
          </g>
        {/if}
      {/each}

      <!-- LPS table -->
      <text x={20} y={185} fill="#64748b" font-size={11} font-family="'JetBrains Mono', monospace">
        LPS: [{lps.join(', ')}]
      </text>

      {#if matches.length > 0}
        <text x={20} y={210} fill={COLORS.found} font-size={12} font-family="'JetBrains Mono', monospace" font-weight="600">
          Znaleziono na pozycjach: [{matches.join(', ')}]
        </text>
      {/if}
    </svg>
  {/if}
{/if}
