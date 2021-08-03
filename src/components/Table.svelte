<script>

    export let currentZoom ;

    export let inquinanti;
    export let dataToShow;


</script>
{#if dataToShow}
<div class="table-container">
    <table>
        <thead class="title-text fix">
        <th>timestamp</th>
        {#each inquinanti as inquinante}
            {#if inquinante != "timestamp"}
                <th>{inquinante}</th>
            {/if}
        {/each}
        </thead>
        <tbody>
        {#each dataToShow as row}
            <tr class="secondary-title-text">
            <td>{row["timestamp"]}</td>
            {#each inquinanti as prop}
                {#if prop != "timestamp"}
                    <td>{row[prop]}</td>
                {/if}
            {/each}
            </tr>

        {/each}
        </tbody>
    </table>
</div>
    {/if}
<style>
    table{
        border-collapse: separate;
    }
    .table-container{
        max-height: 50vh;
        overflow-y: scroll;
        overflow-x: scroll;
        margin-bottom: 3em;
    }
    td{
        text-align: center;
        border:1px solid #eee;
        padding: 2px;
    }

    thead{
        border-bottom: 1px solid #333;
    }
    tr:nth-child(even){
        background: #a1e5ab;

    }
    .fix{
        position: -webkit-sticky;
         position: sticky;
        top: 0;
        z-index: 10;
        background: #fff;
    }
</style>
