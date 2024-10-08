class Registry {
    constructor() {
        this._data = {}
    }

    add(obj) {
        this._data[obj.id] = obj
    }

    remove(id) {
        delete this._data[id]
    }
    
    get(id) {
        return this._data[id]
    }
}


class Session {

    constructor() {
        this.registry = new Registry();
    }

    create(method, url, body, callback) {
        makeRequest(method, url, body, (obj) => {
            this.registry.add(obj)
            callback(id)
        })
    }
    
    update(method, url, id, body, callback) {
        url += "?id=" + id
        makeRequest(method, url, body, (obj) => {
            this.registry.add(obj)
            callback(id)
        })
    }
    
    filter(method, url, body, callback) {
        url = new URL(url)
        let params = new URLSearchParams(body)
        url.search = params.toString()
        makeRequest(method, url.toString(), {}, (objs) => {
            let ids = []
            objs.forEach(element => {
                this.registry.add(element);
                ids.push(element.id)
            })
            callback(ids)
        })
    }
}

function makeRequest(method, url, body, callback) {
    let req = new XMLHttpRequest()
    req.open(method, url, true)
    let token = localStorage.getItem("token")
    if (token) {
        req.setRequestHeader("Authorization", "Bearer " + token)
    }
    
    req.setRequestHeader("Accept", "application/json")
    req.onload = () => {
        callback(JSON.parse(req.response))
    }

    req.send(JSON.stringify(body))
}


class Recordset {
    constructor(method, origin, session, filter, ids) {
        this.method = method
        this.origin = origin
        this.registry = this.session.registry
        this.filter = filter
        this.session = session
        this.ids = ids
    }

    index(i) {
        if (i < 0 || i >= this.ids.length) {
            return undefined
        }

        return this.registry.get(this.ids[i])
    }

    indexMany(start, end) {
        if (start < 0 || end < 0 || start >= this.ids.length || end >= this.ids.length) {
            return undefined
        }

        let objs = []
        for (let i = start; i < end; i++) {
            objs.push(this.registry[this.ids[i]])
        }

        return objs
    }

    indexAll() {
        let objs = [];
        for (let i = 0; i < this.ids.length; i++) {
            objs.push(this.registry[this.ids[i]]);
        }

        return objs;
    }

    forEach(func) {
        this.ids.forEach((id, index) => func(this.index(index)))    
    }

    load() {
        this.session.filter(this.method, this.origin, this.filter, ids => this.ids = ids)
    }
}