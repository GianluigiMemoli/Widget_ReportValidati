<script>
    import {Button} from "svelte-materialify";
    import DynamicSelect from "./DynamicSelect.svelte";
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();

    export let dati = {};
    let _inquinanti;
    function updateInquinanti(){
        let inquinanti = new Set();
        dati[_fonte][_luogo].forEach(record => {
            Object.keys(record).forEach(inquinante => inquinanti.add(inquinante));
        });
        _inquinanti = Array.from(inquinanti);
    }


    let luoghi = [];
    let _fonte;
    let _luogo;
</script>
{#if dati}
<div>
    <DynamicSelect labelValue="Fonte" data={Object.keys(dati)} on:selectChanged={(e) => {_fonte = e.detail.data; luoghi = Object.keys(dati[_fonte])}}></DynamicSelect>
    <br>
    <DynamicSelect labelValue="Luogo" data={luoghi} on:selectChanged={(e) => {_luogo = e.detail.data}}></DynamicSelect>
    <br>
    <Button class="primary" on:click={() => {updateInquinanti(); dispatch("showData", {data: dati[_fonte][_luogo], inquinanti: _inquinanti})}}>Mostra tabella</Button>
</div>
    {/if}
