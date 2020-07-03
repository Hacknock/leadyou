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
        subtitle.setAttribute('class', 'subTitle');
        const titleSub = this.getAttribute('nameTitle');
        const hiddenTitle = this.getAttribute('hiddenTitle');
        subtitle.textContent = titleSub;

        // Create description holder
        const description = document.createElement('p');
        description.setAttribute('class', 'shortDescription');
        const descShort = this.getAttribute('descShort');
        description.textContent = descShort;

        // Create form 
        const radioY = document.createElement('input');
        const labelY = document.createElement('label');
        const radioN = document.createElement('input');
        const labelN = document.createElement('label');
        const subject = this.getAttribute('subject');
        radioY.setAttribute('type', 'radio');
        radioY.setAttribute('name', subject);
        radioY.setAttribute('value', 'Yes');
        radioY.setAttribute('class', 'field');
        labelY.textContent = "Yes";
        radioN.setAttribute('type', 'radio');
        radioN.setAttribute('name', subject);
        radioN.setAttribute('value', 'No');
        radioN.setAttribute('class', 'field');
        labelN.innerText = 'No';
        wrapper.appendChild(radioY);
        wrapper.appendChild(labelY);
        wrapper.appendChild(radioN);
        wrapper.appendChild(labelN);

        // Create some CSS to apply to the shadow dom
        const style = document.createElement('style');
        console.log(style.isConnected);
        style.textContent = ``;

        console.log('hidden title', hiddenTitle)

        if (hiddenTitle) {
            style.textContent = style.textContent + `
                h2 {
                    display: none;
                }
            `;
        }

        // Append Child
        shadow.appendChild(style);
        // shadow.appendChild(wrapper);
        shadow.appendChild(subtitle);
        shadow.appendChild(description);
        shadow.appendChild(wrapper);
    }

    static get observedAttributes() { return ["nameTitle", "hiddenTitle", 'descShort']; }

    attributeChangedCallback(attr, oldVal, newVal) {
        console.log('my-el attribute changed', attr);
        console.log('new value is ', newVal);
        if (attr === 'nameTitle') {
            // Create title holder
            this.shadowRoot.querySelector('.subTitle').textContent = newVal;
        } else if (attr === 'descShort') {
            // Create description holder
            this.shadowRoot.querySelector('.shortDescription').textContent = newVal;
        } else if (attr === "hiddenTitle") {
            console.log('hidden title nyao');
            this.updateStyle(this);
        }
    }

    updateStyle(elem) {
        var shadow = elem.shadowRoot;
        var childNodes = shadow.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeName === 'STYLE') {
                childNodes[i].textContent += `
                h2 {
                    display: none;
                }
            `;
            }
        }
    }
}
// Define the new element
customElements.define('wrap-radio', WrapRadio);