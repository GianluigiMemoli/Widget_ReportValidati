<script>

    import {frequenze, date, downloaded} from "./stores";
    import {get} from "svelte/store";
    import {getAnni, getFrequenze, getMesi, getGiorni, formatRecords} from "./dataFormatter";
    import DynamicSelect from "./DynamicSelect.svelte";
    import FrequenzeCheckboxes from "./FrequenzeCheckboxes.svelte";
    import PeriodoInput from "./PeriodoInput.svelte";
    import {Button} from "svelte-materialify";
    import {cercaProgettoValidato, getProgettiDisponibili, downloadPDF} from "./requests";
    import {createEventDispatcher} from "svelte";
    import Table from "../components/Table.svelte";
    import DataSelector from "./DataSelector.svelte";

    const dispatch = createEventDispatcher();
    let nomeProgetti = [];
    let _nomeProgetto = "";

    let prom = getProgettiDisponibili();
    let tipoProgetto = "final";
    let currentStep = 0;
    let _downloaded;
    let _downloadedFreqs = [];
    let _anni = [];
    let _mesi = [];
    let _giorni = [];
    let _currFreq;
    let _currAnno;
    let _currMese;
    let _currGiorno;
    prom.then(progetti => {
        progetti.result.forEach(prj => nomeProgetti.push(prj.progetto));
        console.log(nomeProgetti);
    });

    function cerca() {
        let nome = _nomeProgetto;
        let inizio = get(date)["start_date"];
        let fine = get(date)["end_date"];
        let _frequenze = get(frequenze);
        if (nome.trim().length == 0) {
            alert("Seleziona nome");
            return;
        }
        if (inizio == null || fine == null) {
            alert("Seleziona data");
            return;
        }
        if (_frequenze.length == 0) {
            alert("Seleziona frequenze");
            return;
        }
        dispatch("loading", {loading: true, txt: "Cerco report.."});
        cercaProgettoValidato(nome, _frequenze, inizio, fine, tipoProgetto).then(r => {
            console.log(r.result);
            if (r.result === "") {
                alert(r.message);
                dispatch("loading", {loading: false});
            } else {
                _downloaded = JSON.parse(r.result);
                _downloadedFreqs = getFrequenze(_downloaded);
                downloaded.update((s) => {
                    s = _downloaded;
                    return s;
                });

                dispatch("loading", {loading: false});
                currentStep++;
            }
        });

    }
    let _records;
    let _inquinanti;
    let _showData;
    function createRecords() {
        let records;
        try {
            if (_currFreq == "giornalieri") {
                records = formatRecords(_downloaded, _currFreq, _currAnno, _currMese, _currGiorno);
            }
            if (_currFreq == "mensili") {
                records = formatRecords(_downloaded, _currFreq, _currAnno, _currMese);
            }
            if (_currFreq == "settimanali") {
                let date = _currMese.split("-")[0];
                records = formatRecords(_downloaded, _currFreq, _currAnno, undefined, undefined, date);
            }
            console.log(records);
            _records = records;
            if (_records != undefined)
                currentStep++;
        } catch(e)
        {
            alert("Compila i campi");
        }
    }
    function downloadPdf(){
        console.log(_nomeProgetto);
        dispatch("loading", {loading: true, txt: "Download pdf.."})
        let date = _currMese.split("-")[0];
        if(_currFreq == "giornalieri")
            downloadPDF(_nomeProgetto, _currFreq, _currAnno, _currMese, _currGiorno).then(() => dispatch("loading", {loading: false, txt: "Download pdf.."}));
        if(_currFreq == "mensili")
            downloadPDF(_nomeProgetto, _currFreq, _currAnno, _currMese).then(() => dispatch("loading", {loading: false, txt: "Download pdf.."}));;
        if(_currFreq == "settimanali")
            downloadPDF(_nomeProgetto, _currFreq, undefined, undefined, date).then(() => dispatch("loading", {loading: false, txt: "Download pdf.."}));;
    }
</script>
{#if currentStep == 0}
    <div class="centered">
        {#await prom}
            <p></p>
            {:then x}
            <DynamicSelect storeField="nomeProgetto" labelValue="Nome progetto" data={nomeProgetti} on:selectChanged={(e) => _nomeProgetto = e.detail.data}></DynamicSelect>
        {/await}
        <FrequenzeCheckboxes></FrequenzeCheckboxes>
        <PeriodoInput></PeriodoInput>
        <p class="description-text"> Tipo report</p>
        <div id="tipoReport">
            <label><input name="tipoProgetto" type="radio" value="final" checked on:change={() => tipoProgetto = "final"}>Final</label>
            <label><input name="tipoProgetto" type="radio" value="draw" on:change={() => tipoProgetto = "draw"}>Draw</label>
        </div>
        <div class="buttonAlone">
            <Button class="primary" on:click={cerca}>Cerca progetto</Button>
        </div>
    </div>
{/if}
{#if currentStep == 1}
    <div class="centered">
        <DynamicSelect labelValue="Frequenza" data={_downloadedFreqs} on:selectChanged={(e) => {_currFreq = e.detail.data; _anni = getAnni(_downloaded, _currFreq)}  }></DynamicSelect><br>
        <DynamicSelect labelValue="Anno" data={_anni} on:selectChanged={(e) => {_currAnno = e.detail.data; _mesi=getMesi(_downloaded, _currFreq, _currAnno)}}></DynamicSelect><br>
        <DynamicSelect labelValue="Mese" data={_mesi} on:selectChanged={(e) => {_currMese = e.detail.data; _giorni = getGiorni(_downloaded, _currFreq, _currAnno, _currMese)}}></DynamicSelect><br>

        {#if  _currFreq != "mensili" && _currFreq != "settimanali"}
            <DynamicSelect labelValue="Giorno" data={_giorni} on:selectChanged={(e) => {_currGiorno = e.detail.data}}></DynamicSelect><br>
        {/if}
        <div class="buttonContainer">
            <Button class="secondary" on:click={()=>currentStep--} >Indietro</Button>
            <Button class="primary" on:click={createRecords}  >Mostra dati</Button>
        </div>
    </div>
{/if}
{#if  currentStep == 2 && _records}
    <div class="centered">
        <DataSelector dati={_records} on:showData={(e) => {
            try{
            _inquinanti = e.detail.inquinanti;
            _showData = e.detail.data;}
            catch(e){
                alert("Compila i campi");
            }
        }}></DataSelector>
        <Table inquinanti={_inquinanti} dataToShow={_showData}></Table>
        {#if tipoProgetto == "final"}
        <div class="buttonContainer">
            <Button class="secondary" on:click={()=>currentStep--} >Indietro</Button>

            <Button class="primary" on:click={downloadPdf}>Download pdf</Button>
        </div>
                {/if}
    </div>
{/if}
<style>
    #tipoReport{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    #tipoReport > label{
        display: inline-block;
        margin-right: 1em;
    }

    .centered{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .buttonContainer{
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
        align-items: flex-end;
    }
    .buttonAlone{
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: flex-end;
        align-items: flex-end;
    }
</style>
