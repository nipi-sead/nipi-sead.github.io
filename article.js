
const boletimTemplate = document.createElement("template")
boletimTemplate.innerHTML = `
<style>
    h1 {
        font-size: 42px;
        font-weight: 600;
    }
    h4 {
        font-size: 28px;
    }
    p {
        font-size: 26px;
    }

    html, body {
        margin: 0;
        padding: 0px;
        max-width: 100%;
    }

    body {
        
        background-image: url("26-White-Paper-Background-Textures-Square-preview-9.jpg");
        background-repeat: repeat;
        background-size: 900px 900px;
    }
    header, main, footer {
        font-family: "Rubik", sans-serif;
        padding: 0;
        width: 100%;
    }

    h1 {
        margin: 0;
        color: #444444;
    }
    h4 {
        font-weight: 500;
        color: #747474;
        margin: 0;
    }
    p {
        color: #262626;
        font-family: 'Noto Sans', Times, serif;
        text-indent: 2rem;
        text-align: justify;
    }

    header {
        margin-top: 32px;
    }

    .sead-logo {
        right: 0;
        width: 350px;
        height: 700px;
        position: absolute;
        background-image: url("logo-dark.png");
        opacity: 0.17;
        background-repeat: no-repeat;
        background-position-x: right;
        background-size: 360px;
        background-blend-mode: overlay;
    }

    .dotted-border {
        height: 1px; 
        border-bottom: 4px solid rgb(143, 143, 143);
        margin-top: 2px;
    }

    .solid-border {
        height: 1px; 
        border-bottom: 6px solid rgb(147, 147, 147); 
        margin-top: 4px;
    }

    .headline {
        padding: 0 32px;
        margin-bottom: 16px;
    }

    main, footer {
        display: none;
        padding: 0px 32px;
        width: calc(100% - 64px);
    }

    footer {
        border-bottom: 4px groove black;
    }
</style>
<div>
    <header>
        <div class="headline">
            <h1 id="title"></h1>
        </div>
        <div class="dotted-border">
        </div>
        <div class="solid-border">
        </div>
    </header>
    <main>
    </main>
    <footer>
        <p style="text-align: right; font-style: italic;">Publicado por: <span id="author_name"></span></p>
    </footer>
</div>
`

class Article extends HTMLElement{

    constructor() {
        super();
        this._shadow = this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(boletimTemplate.content.cloneNode(true))
        this._isCollapsed = false
        this._header = this.shadowRoot.querySelector("header")
        this._authorName = this.shadowRoot.querySelector('#author_name')
        this._text = this.shadowRoot.querySelector("main")
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
        this._text.querySelectorAll("p").forEach(element => {
            t += element.innerHTML
        });

        return t
    }

    set text(value) {
        this._text.innerHTML = ""
        value.split("\n").forEach(element => {
            this._text.innerHTML += `<p>${element}</p>`
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
        this._text.style.display = "block"
        this._footer.style.display = "block"
    }

    collapse() {
        this._text.style.display = "none"
        this._footer.style.display = "none"
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
    return article;
}