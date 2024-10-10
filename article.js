
const boletimTemplate = document.createElement("template")
boletimTemplate.innerHTML = `
<style>
    @media only screen and (max-width: 600px) {
        h1 {
            font-size: 36px;
        }

        p, h2{
            font-size: 18px;
        }

        h3 {
            font-size: 16px;
        }
    }

    h1, h3, p {
        font-family: 'Rubik', sans-serif;
    }
</style>
<div style="border: 2px solid black; padding: 0px">
    <header>
        <h1 style="padding: 8px 16px; margin: 0px;" id="title"></h1>
    </header>
    <main id="body" style="padding: 8px 16px;">
    </main>
</div>
<footer style="text-align: right;">
    <h3>Publicado por: <span id="author_name"></span></h3>
</footer>
`

class Article extends HTMLElement{

    constructor() {
        super();
        this._shadow = this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(boletimTemplate.content.cloneNode(true))
        this._isCollapsed = false
        this._header = this.shadowRoot.querySelector("header")
        this._authorName = this.shadowRoot.querySelector('#author_name')
        this._body = this.shadowRoot.querySelector("#body")
        this._title = this.shadowRoot.querySelector("#title")
        this._footer = this.shadowRoot.querySelector("footer")
        this._onExpand = []
    }

    connectedCallback() {
        this._header.addEventListener("click", () => {
            if (this._isCollapsed == true) {
                this.expand()
            } else {
                this.collapse()
            }

            this._isCollapsed = !this._isCollapsed
        })
    }

    get title() {
        return this._title.innerHTML
    }

    set title(value) {
        this._title.innerHTML = value
    }

    get text() {
        t = ""
        this._body.querySelectorAll("p").forEach(element => {
            t += element.innerHTML
        });

        return t
    }

    set text(value) {
        this._body.innerHTML = ""
        value.split("\n").forEach(element => {
            this._body.innerHTML += `<p>${element}</p>`
        })
    }

    get authorName() {
        return this._authorName.innerHTML
    }

    set authorName(value) {
        this._authorName.innerHTML = value
    }

    expand() {
        this._onExpand.forEach(func => func())
        this._body.style.display = "block"
        this._footer.style.display = "block"
    }

    collapse() {
        this._body.style.display = "none"
        // this._footer.style.display = "none"
    }

    addActionOnExpand(func) {
        this._onExpand.push(func)
    }
    
    bind(record) {
        this.record = record;
    }

    reload() {
        this.record.load();
    }

    render() {
        let vals = this.record.vals();
        this.title = vals.title;
        this.text = vals.text;
        this.authorName = vals.authorName;
    }
}

window.customElements.define("sga-article", Article)

function newArticle(record) {
    let article = document.createElement("sga-article");
    article.bind(record);
    article.render();
    return article;
}