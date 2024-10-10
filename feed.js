
const feedTemplate = document.createElement("template")
feedTemplate.innerHTML = `
<link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.6.0/css/all.css"/>
<style>
@media only screen and (max-width: 600px) {
    body {
        font-size: 32px;
    }
    .all {
        width: 100%;
        max-width: 100%;
    }
    h1 {
        font-size: 36px;
    }

    p, h2{
        font-size: 18px;
    }

    h3 {
        font-size: 16px;
    }
    .faixa {
        max-width: 50px;
    }
}

@media only screen and (min-width: 1000px) {
    .all {
        margin: auto;
        width: 100%;
        max-width: 900px; 
    }

    #boletim {
        font-size: 100px;
    }

    .faixa {
        max-width: 150px;;
    }
}

h1, h2, p {
    font-family: 'Rubik', sans-serif;
}
    .right {
        max-height: 100%;
        overflow-y: scroll;
        margin-right: 16px;
    }

    .all {
        height: 100vh;
        max-height: 100vh;
        overflow: hidden;
    }
</style>
<div class="all" style="display: flex;">
    <div class="faixa" style="flex: 1; background-color: #F2B705; margin-right: 16px;">
        <h1 id="boletim" style="writing-mode: tb-rl; transform: rotate(-180deg); height: 100%; width: 100%; margin-left: -8px; color: #F7F1FD;">BOLETIM</h1>
    </div>
    <div class="right" style="flex: 3">
        <h2 style="margin: 4px 16px 8px 16px; text-align: center; background-color: #F2B705; padding: 8px;">
            SGA - Boletim / SEAD
        </h2>
        <div id="article-list">
        </div>
        <div style="text-align: right; position: absolute; bottom: 0; right: 0;">
            <img src="sead.png" height="70px" style="text-align:right;"/>
        </div>
    </div>
</div>
`


class SgaFeed extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(feedTemplate.content.cloneNode(true))
        this._active = -1
        this._articles = []
        this._articleList = this.shadowRoot.querySelector("#article-list")
    }

    connectedCallback() {
        let nav = this.shadowRoot.querySelector(".btn-nav")
        this._minusBtn = newButton({
            label: `<i class="fa-solid fa-minus"></i>`,
            action: () => this.decreaseFontSize(),
        })

        this._plusBtn = newButton({
            label: `<i class="fa-solid fa-plus"></i>`,
            action: () => this.increaseFontSize(),
        })

        this._leftBtn = newButton({
            label: `<i class="fa-solid fa-caret-left"></i>`,
            action: () => this.displayPreviousArticle(),
        })

        this._rightBtn = newButton({
            label: `<i class="fa-solid fa-caret-right"></i>`,
            action: () => this.displayNextArticle(),
        })

        this._closeBtn = newButton({
            label: `<i class="fa-solid fa-xmark"></i>`,
            action: () => this.closeArticles(),
        })

        nav.append(this._minusBtn, this._plusBtn, this._leftBtn, this._rightBtn, this._closeBtn)

    }

    // load(method, url, session) {
    //     this.method = method
    //     this.url = url
    //     this.session = session
    //     this.session.filter(method, url, {limit: 20, offset: 20}, recordset =>)
    // }

    setArticles(articles) {
        this._articleList.innerHTML = ""
        articles.forEach((article, index) => {
            this._articleList.appendChild(article)
            article.addActionOnExpand(() => {
                this.closeArticles();
                this._active = index;
            })
        })
        this._active = -1
        this._articles = articles
    }

    decreaseFontSize() {
    
    }

    increaseFontSize() {
    
    }

    displayPreviousArticle() {
        if (this._active <= 0) return;

        this._articles[this._active].collapse()
        this._active -= 1
        this._articles[this._active].expand()
    }

    displayNextArticle() {
        if (this._articles.length == 0) return;
        if (this._active == this._articles.length - 1) return;
        
        if (this._active > -1)
            this._articles[this._active].collapse();
        
        this._active += 1
        this._articles[this._active].expand()
    }

    closeArticles() {
        if (this._active == -1) return;
        this._articles[this._active].collapse()
        this._active = -1
    }

    bind(record) {
        this.record = record;
    }

    load() {
        this.record.load();
    }

    render() {
        this._articles = [];
        this.record.indexAll().forEach((r, index) => {
            let article = newArticle(r);
            article.addActionOnExpand(() => {
                this.closeArticles();
                this._active = index;
            })
            this._articleList.appendChild(article);
            article.render();
            this._articles.push(article);
        })

        this._active = -1;
    }
}

window.customElements.define("sga-feed", SgaFeed)