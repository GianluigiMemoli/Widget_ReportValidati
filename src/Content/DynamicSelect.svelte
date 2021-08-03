<script>
    import { createEventDispatcher } from 'svelte';
    import {afterUpdate, beforeUpdate} from 'svelte';
    export let labelValue = "Generic select";
    export let data = null;
    export let storeField = 'default';
    const dispatch = createEventDispatcher();
    let customSelect;


    function updateLuogoRicerca(value){
        console.log("aggiorno" + labelValue+ "con");
        console.log(value);
        if(value)
            dispatch('selectChanged', {data: value});

    }
    beforeUpdate(()=>{
       data.unshift('');
    });
    afterUpdate(() => {

            updateLuogoRicerca(data[0]);

    });

</script>
<label class="secondary-title-text">{labelValue}<br>
    <select bind:this={customSelect} on:change={(e) => updateLuogoRicerca(e.target.value)}>
        {#each data as value}
            <option>{value}</option>
        {/each}
    </select>
</label>

<style>
    label{
        display: inline;
    }
    select{
        border-bottom: 1px solid black;
        min-width: 200px;
    }
</style>
