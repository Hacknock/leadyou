
class WrapMultiField extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        //Create a shadow root
        const shadow = this.attachShadow({ mode: 'open' });

        // Create sections
        const wrapper = document.createElement('section');

        // Create title holder
        const subtitle = document.createElement('h2');
        const titleSub = this.getAttribute('nameTitle');
        subtitle.textContent = titleSub;

        // Create description holder
        const description = document.createElement('p');
        const descShort = this.getAttribute('descShort');
        description.textContent = descShort;

        // Create form 
        const inputF = document.createElement('input');
        inputF.setAttribute('type', 'text');
        inputF.setAttribute('maxlength', 140);
        inputF.setAttribute('class', 'multiField')

        // Create some CSS to apply to the shadow dom
        const style = document.createElement('style');
        console.log(style.isConnected);
        style.textContent = `
        
        .multiField {
            width: 100%;
            height: 30%;
        }

        section {
            padding: 0 10%;
            height: 100%;
        }
        
        `;

        // Append Child
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(subtitle);
        wrapper.appendChild(description);
        wrapper.appendChild(inputF);
    }
    static get observedAttributes() { return ["nameTitle"]; }

    attributeChangedCallback(attr, oldVal, newVal) {
        console.log('my-el attribute changed', attr);
        console.log('new value is ', newVal);
        // Create title holder
        const subtitle = document.createElement('h2');
        subtitle.textContent = newVal;
        this.shadowRoot.appendChild(subtitle);
        //        this.appendChild(subtitle);
        this._updateRendering();
    }

    _updateRendering() {
        console.log("nyao");
    }
}
// Define the new element
customElements.define('wrap-multiline-field', WrapMultiField);