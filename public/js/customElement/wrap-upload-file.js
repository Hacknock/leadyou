class WrapUploadFile extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        //Create a shadow root
        const shadow = this.attachShadow({ mode: 'open' });

        // Create sections
        const wrapper = document.createElement('section');

        // Create title holder
        const subtitle = document.createElement('h2');
        subtitle.setAttribute('class', 'subTitle');
        const titleSub = this.getAttribute('nameTitle');
        subtitle.textContent = titleSub;

        // Create description holder
        const description = document.createElement('p');
        description.setAttribute('class', 'shortDescription')
        const descShort = this.getAttribute('descShort');
        description.textContent = descShort;

        // Create form 
        const formF = document.createElement('form');
        const upFile = document.createElement('input');
        const descFile = document.createElement('input');

        upFile.setAttribute('type', 'file');
        upFile.setAttribute('name', 'fig');

        descFile.setAttribute('type', 'text');

        formF.appendChild(upFile);
        formF.appendChild(descFile);

        // Create some CSS to apply to the shadow dom
        const style = document.createElement('style');
        console.log(style.isConnected);
        style.textContent = ``;

        // Append Child
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(subtitle);
        wrapper.appendChild(description);
        wrapper.appendChild(formF);
    }

    static get observedAttributes() { return ["nameTitle", "descShort"]; }

    attributeChangedCallback(attr, oldVal, newVal) {
        console.log('my-el attribute changed', attr);
        console.log('new value is ', newVal);
        if (attr === 'nameTitle') {
            // Create title holder
            this.shadowRoot.querySelector('.subTitle').textContent = newVal;
        } else if (attr === 'descShort') {
            // Create description holder
            this.shadowRoot.querySelector('.shortDescription').textContent = newVal;
        }
    }
}
// Define the new element
customElements.define('wrap-upload-file', WrapUploadFile);