// function makeRequest(method, url, body, callback) {
//     let req = new XMLHttpRequest()
//     req.open(method, url, true)
//     let token = localStorage.getItem("token")
//     if (token) {
//         req.setRequestHeader("Authorization", "Bearer " + token)
//     }
    
//     req.setRequestHeader("Accept", "application/json")
//     req.onload = () => {
//         callback(JSON.parse(req.response))
//     }

//     req.send(JSON.stringify(body))
// }

function makeRequest(method, url, body, callback) {
    callback([
        {
            title: "Suprimento de fundos",
            text: "Descrição:\n" +
            "Despesa urgente e de pronto pagamento.\n"+
            "Objetivo:\n" +
            "Atender as necessidade de com despesas de caráter urgente da SEAD.",
            authorName: "Laércio Pinheiro",
        },
        {
            title: "Concessão de Diárias",
            text: "Descrição:\n" +
            "Despesa urgente e de pronto pagamento.\n" +
            "Objetivo:\n" +
            "As diárias destinam-se a indenizar o agente público ou colaborador " + 
            "eventual pelas despesas extraordinárias com hospedagem, alimentação " + 
            "e locomoção urbana, realizadas durante o período de deslocamento no " + 
            "interesse da administração pública.",
            authorName: "Laércio Pinheiro"
        },
        {
            title: "Passagens concedidas", 
            text:"Descrição:\nA fim de prestar contas das passagens emitidas para os "+
            "servidores da SEAD e para os órgãos externos." +
            "Objetivo:\n" +
            "Realizar o controle dos contratos para emissão de passagens aéreas. Processo" + 
            "do contrato das passagens nº 00002.004253/2024 - 18.", 
            authorName: "Liviane Mendes"
        },
    ])
}

class Registry {
    
    constructor() {
        this._data = {};
    }

    get(id) {
        return this._data[id];
    }

    add(obj) {
        this._data[obj.id] = obj;
    }

    remove(id) {
        delete this._data[id];
    }
}


class Recordset {

    constructor(method, url, session, filter, ids) {
        this.method = method;
        this.url = url;
        this.session = session;
        this.registry = this.session.registry;
        this.ids = ids;
    }

    index(i) {
        return new Recordset(
            this.method,
            this.url,
            this.session,
            {id: this.ids[i]},
            this.registry.get(this.ids[i]))
    }

    indexMany(start, end) {
        let records = []
        for (let i = start; i < end; i++) {
            records.push(this.registry.get(this.ids[i]))
        }
        return new Recordset(
            this.method,
            this.url,
            this.session,
            this.filter,
            ...records)
    }

    indexAll() {
        return this.indexMany(0, this.ids.lenght);
    }

    get(prop) {
        return this.registry.get(this.ids[0])[prop]
    }

    vals() {
        return JSON.parse(JSON.stringify(this.registry.get(this.ids[0])))
    }

    load() {
        this.session._filter(this.method, this.url, this.filter, ids => {
            this.ids = ids;
        })
    }
}


class Session {

    constructor() {
        this.registry = new Registry();
    }
    
    create(method, url, data) {
        makeRequest(method, url, data, (obj) => {
            this.registry.add(obj)
            callback(new Recordset(method, url, this, {id: obj.id}, obj.id));
        })
    }
    
    update(method, url, id, data) {
        url += "?id=" + id
        makeRequest(method, url, data, (obj) => {
            this.registry.add(obj)
            callback(new Recordset(method, url, this, {id: obj.id}, obj.id));
        })
    }

    _filter(method, url, data, callback) {
        makeRequest(method, url, data, objs => {
            let ids = [];
            objs.forEach(element => {
                this.registry.add(element);
                ids.push(element.id);
            });

            callback(ids);
        })
    }

    filter(method, url, data, callback) {
        this._filter(method, url, data, ids => {
            callback(new Recordset(method, url, this, data, ids));
        })
    }
}