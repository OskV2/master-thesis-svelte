<script>
  import { bubbleSortSteps } from '$lib/algorithms/bubbleSort.js';
  import SortingAlgorithmView from './SortingAlgorithmView.svelte';
</script>

<SortingAlgorithmView generateSteps={bubbleSortSteps} />
