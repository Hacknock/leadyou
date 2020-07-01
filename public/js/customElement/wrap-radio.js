class WrapRadio extends HTMLElement {
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
        const formF = document.createElement('form');
        const radioY = document.createElement('input');
        const labelY = document.createElement('label');
        const radioN = document.createElement('input');
        const labelN = document.createElement('label');
        const subject = this.getAttribute('subject');
        radioY.setAttribute('type', 'radio');
        radioY.setAttribute('name', subject);
        radioY.setAttribute('value', 'Yes');
        labelY.textContent = "Yes";
        radioN.setAttribute('type', 'radio');
        radioN.setAttribute('name', subject);
        radioN.setAttribute('value', 'No');
        labelN.innerText = 'No';
        formF.appendChild(radioY);
        formF.appendChild(labelY);
        formF.appendChild(radioN);
        formF.appendChild(labelN);

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

    static get observedAttributes() { return ["nameTitle"]; }

    attributeChangedCallback(attr, oldVal, newVal) {
        console.log('my-el attribute changed', attr);
        console.log('new value is ', newVal);
        // Create title holder
        const subtitle = document.createElement('h2');
        subtitle.textContent = newVal;
        this.shadowRoot.appendChild(subtitle);
        //        this.appendChild(subtitle);
    }
}
// Define the new element
customElements.define('wrap-radio', WrapRadio);