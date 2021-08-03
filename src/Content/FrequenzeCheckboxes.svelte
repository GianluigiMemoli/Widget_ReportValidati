<script>
    import {frequenze} from "./stores.js";
    import {get} from "svelte/store";
    let frequenzeNames = ["giornalieri", "settimanali", "mensili"];

    function updateFrequenze(frequenza){

        frequenze.update(self => {
            let idx = self.indexOf(frequenza);
            if(idx >= 0){
                self.splice(idx, 1);
            } else self.push(frequenza);
            return self;
        });
    }

    let frequenzeStored = get(frequenze);

</script>
<div id="frequenze">
    <p class="description-text">Frequenze</p>
    {#each frequenzeNames as frequenza}
        <label>{frequenza}
            <input name = "frequenze"  type="checkbox" on:change={() => updateFrequenze(frequenza)} checked={frequenzeStored.includes(frequenza)}/>
        </label>
    {/each}
</div>

<style>
    #frequenze > label{
        display: inline;
        margin-right: 1em;
    }
</style>
