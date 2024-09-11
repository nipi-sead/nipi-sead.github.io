const buttonTemplate = document.createElement("template")

buttonTemplate.innerHTML = `
<link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.6.0/css/all.css"/>
<style>
root {
    flex: 1;
}
.btn-container {
    margin: 8px 2px;
    width:100%;;
    flex:1;
    background-color: rgb(198, 198, 198);
    border-radius: 8px;
    padding: 1px 1px 8px 1px;
    box-shadow: 2px 2px 8px 1px rgba(0, 0, 0, 0.1), 
                -2px -2px 8px 1px rgba(0, 0, 0, 0.1);
}
#inner-btn {
    font-size: 36px;
    width: 100%;
    padding: 8px 0px;
    border: none;
    background-color: white;
    border-radius: 8px;
    box-sizing: border-box;
}
</style>
<div class="btn-container">
    <button id="inner-btn"></button>
</div>
`

class SgaButton extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(buttonTemplate.content.cloneNode(true))
        this._btn = this.shadowRoot.querySelector("#inner-btn")
    }

    connectedCallback() {
        this.style.flex = 1;
        this.style.margin = "4px"
    }

    get label() {
        return this._btn.innerHTML
    }

    set label(value) {
        this._btn.innerHTML = value
    }

    setAction(func) {
        this.addEventListener("click", func)
    }
}

window.customElements.define("sga-btn", SgaButton)

function newButton(args) {
    let btn = document.createElement("sga-btn")
    btn.label = args.label
    btn.setAction(args.action)
    return btn
}