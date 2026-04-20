<script>
  import { mergeSortSteps } from '$lib/algorithms/mergeSort.js';
  import SortingAlgorithmView from './SortingAlgorithmView.svelte';
</script>

<SortingAlgorithmView generateSteps={mergeSortSteps} />
