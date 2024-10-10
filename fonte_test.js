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
    callback({
        id: 1,
        title: "Suprimento de fundos",
        text: "Descrição:\n" +
        "Despesa urgente e de pronto pagamento.\n"+
        "Objetivo:\n" +
        "Atender as necessidade de com despesas de caráter urgente da SEAD.",
        authorName: "Laércio Pinheiro",
    })
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

    constructor(method, url, session, filter, ...ids) {
        this.method = method;
        this.url = url;
        this.session = session;
        this.registry = this.session.registry;
        this.filter = filter;
        this.ids = ids;
    }

    index(i) {
        return new Recordset(
            this.method,
            this.url,
            this.session,
            {id: this.ids[i]},
            this.ids[i])
    }

    indexMany(start, end) {
        let ids = []
        for (let i = start; i < end; i++) {
            ids.push(this.ids[i])
        }
        return new Recordset(
            this.method,
            this.url,
            this.session,
            this.filter,
            ...ids)
    }

    indexAll() {
        return this.indexMany(0, this.ids.length);
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

    forEach(f) {
        console.log(this.ids);
        let ids = this.ids;
        for (let i = 0; i < ids.length; i++) {
            f(new Recordset(this.method, this.url, this.session, {id: ids[i]}, ids[i]), i);
        }
    }
}


class Session {

    constructor() {
        this.registry = new Registry();
    }
    
    create(method, url, data, callback) {
        makeRequest(method, url, data, (obj) => {
            this.registry.add(obj)
            callback(new Recordset(method, url, this, {id: obj.id}, obj.id));
        })
    }
    
    update(method, url, id, data, callback) {
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
            callback(new Recordset(method, url, this, data, ...ids));
        })
    }

    get(method, url, id, callback) {
        if (this.registry.get(id))
            callback(new Recordset(method, url, this, {id: id}, id));
        else 
            this.filter(method, url, {id: id}, callback);
    }
}