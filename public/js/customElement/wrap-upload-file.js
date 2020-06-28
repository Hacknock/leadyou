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
        const titleSub = this.getAttribute('nameTitle');
        subtitle.textContent = titleSub;

        // Create description holder
        const description = document.createElement('p');
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
}
// Define the new element
customElements.define('wrap-upload-file', WrapUploadFile);