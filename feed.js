
const feedTemplate = document.createElement("template")
feedTemplate.innerHTML = `
<link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.6.0/css/all.css"/>
<style>
.article-list {
    width: 100%;
}

.date-picker {
    margin-top: 8px;
    width: 100%;
    height: 56px;
    border: 2px solid #7b7207;
    box-shadow: -4px -4px 8px 1px rgba(0, 0, 0, 0.2),
                4px 4px 8px 1px rgba(255, 255, 255, 1),
                4px 4px 8px 1px rgba(0, 0, 0, 0.1) inset,
                -4px -4px 8px 1px rgba(0, 0, 0, 0.1) inset;
    border-radius: 8px;
    background-color: rgb(169, 169, 5);
}

.date-picker-bg {
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    margin: 4px;
    background-color: rgb(170, 170, 52);
    border-radius: 8px;;
}

.highlight {
    margin-top: 4px;
    height: 16px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.535);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    opacity: 0.4;
    /* border-radius: 8px; */
    mix-blend-mode: lighten;
}

.btn-nav {
    display:  flex;
}
</style>
<div class="article-list">
</div>
<div class="option-menu" style="width: 100%; font-size: 24px;">
    <div class="date-picker">
        <div class="date-picker-bg">
            <div class="highlight"></div>
        </div>
    </div>
    <div class="btn-nav">
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
        this._articleList = this.shadowRoot.querySelector(".article-list")
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