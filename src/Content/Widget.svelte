
<script>
    /* NON MODIFICARE -> INIZIO */
    import ReportValidati from "./ReportValidati.svelte";

    export let showResult, showError, showLoading, showMaintenance, showProgressBar, updateProgressBar, getFormData;
    export let WIDGET_VISIBLE = false;
    /* NON MODIFICARE -> FINE */

    /* ESEMPIO FUNZIONAMENTO ->  INIZIO */
    import {Button} from 'svelte-materialify/src';

    setTimeout(() => {
        showResult();
    });
    /* ESEMPIO FUNZIONAMENTO ->  FINE */

</script>

<main style={WIDGET_VISIBLE ? "" : "display: none"}>


 <ReportValidati on:loading={(e) => {
  if(e.detail.loading){
   showLoading(e.detail.txt);
  } else {
   showResult();
  }
 }}></ReportValidati>

</main>

<style>

    main {
        width: 100%;
        height: 100%;
    }

</style>
