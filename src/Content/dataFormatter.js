import moment from "moment";
export function getFrequenze(data){
    let freqs = [];
    const frequenze = ["giornalieri", "settimanali", "mensili"];
    Object.keys(data).forEach(k => {
        if(frequenze.includes(k)){
            freqs.push(k);
        }
    });
    console.log(freqs);
    return freqs;
}

export function getAnni(data, freq){
    if(freq && freq.length > 0) {
        console.log(Object.keys(data[freq]));
        return Object.keys(data[freq]);
    } else {
        console.log("nulla")
        return [];
    }
}
function _getRangeWeek(anno, settimana){
    let startDay = moment().year(anno).week(settimana);
    let startAsString = startDay.toDate().toLocaleDateString();
    let endDay = startDay.add(6, 'days');
    let endAsString = endDay.toDate().toLocaleDateString();
    return startAsString + "-" + endAsString;
}
export function getMesi(data, freq, anno){
    if(freq && anno && freq.length > 0){
        if(freq == "mensili" || freq == "giornalieri"){
            console.log(Object.keys(data[freq][anno]));
            return Object.keys(data[freq][anno]);
        } else {
            let mesi = new Set();
            Object.keys(data[freq][anno]).forEach(wk => {
               let range = _getRangeWeek(anno, wk);
               mesi.add(range);
            });
            return Array.from(mesi);
        };
    } else return [];
}

export function getGiorni(data, freq, anno, mese){
    if(freq && anno && mese){
        if(freq == "giornalieri"){
            return Object.keys(data[freq][anno][mese]);
        }
        if(freq == "settimanali"){
            return [];
        }
    }
    else return [];
}
export function fromDateToWeek(date){
    let dateObj =  moment(date, "DD/MM/YYYY");
    return dateObj.week();
}

export function formatRecords(data, freq, anno, mese, giorno, date){
    const possibleSources = ["ssq", "arpa_eea", "copernicus"];
    let records = {};
    let dati = {};
    if(freq == "giornalieri") {
        dati = data[freq][anno][mese][giorno].dati;
    } else if(freq == "mensili"){
        dati = data[freq][anno][mese].dati;
    } else if(freq == "settimanali"){
        let week = fromDateToWeek(date);
        week = week + "";
        dati = data[freq][anno][week].dati;
    }

    Object.keys(dati).forEach( k => {
       if(possibleSources.includes(k)){
           records[k] = {};
           Object.keys(dati[k]).forEach(luogo => {
               records[k][luogo] = dati[k][luogo].dati_luogo;
           });
       }
    });
    return records;
}
