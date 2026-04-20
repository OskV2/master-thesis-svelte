<script>
  import { quickSortSteps } from '$lib/algorithms/quickSort.js';
  import SortingAlgorithmView from './SortingAlgorithmView.svelte';
</script>

<SortingAlgorithmView generateSteps={quickSortSteps} />
