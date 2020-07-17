class WrapMultiField extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    //Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Create sections
    const wrapper = this.addInputField();

    // Create title holder
    const subtitle = document.createElement("h2");
    const titleSub = this.getAttribute("nameTitle");
    subtitle.setAttribute("class", "subTitle");
    subtitle.textContent = titleSub;

    // Create description holder
    const description = document.createElement("p");
    description.setAttribute("class", "shortDescription");
    const descShort = this.getAttribute("descShort");
    description.textContent = descShort;

    // add input field button & its event
    const addButton = document.createElement("input");
    addButton.setAttribute("type", "button");
    addButton.setAttribute("value", "add");
    addButton.addEventListener("click", () => {
      //   const newDivWrap = this.addInputField();
      const newDivWrap = this.addInputField();
      shadow.insertBefore(newDivWrap, addButton);
    });

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");
    // console.log(style.isConnected);
    style.textContent = `
    input[type=text] {
        width: 80%;
        height: 160px;
    }

    input[type=button] {
      margin-top: 10px;
    }

    section {
        padding: 0 10%;
        height: 100%;
    }

    .style_alert {
      border: solid 0.7px #E53935;
    }

    .style_normal {
      border: solid 0.7px #000000;
    }
    `;

    // Append Child
    shadow.appendChild(style);
    shadow.appendChild(subtitle);
    shadow.appendChild(description);
    shadow.appendChild(wrapper);
    if (this.getAttribute("multiple") === true) {
      shadow.appendChild(addButton);
    }
  }
  static get observedAttributes() {
    return ["nameTitle", "descShort", "multiple", "alert"];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    // console.log('my-el attribute changed', attr);
    // console.log('new value is ', newVal);

    if (attr === "nameTitle") {
      // Create title holder
      this.shadowRoot.querySelector(".subTitle").textContent = newVal;
    } else if (attr === "descShort") {
      // Create description holder
      this.shadowRoot.querySelector(".shortDescription").textContent = newVal;
    } else if (attr === "multiple" && newVal === "true") {
      const addButton = document.createElement("input");
      addButton.setAttribute("type", "button");
      addButton.setAttribute("value", "add");
      addButton.addEventListener("click", () => {
        const newDivWrap = this.addInputField();

        this.shadowRoot.insertBefore(newDivWrap, addButton);
      });
      this.shadowRoot.appendChild(addButton);
    } else if (attr === "alert") {
      let inputEles = this.shadowRoot.querySelectorAll(".column");
      if (newVal === "true") {
        for (var i = 0; i < inputEles.length; i++) {
          inputEles[i].setAttribute("class", "column style_alert");
        }
      } else {
        for (var i = 0; i < inputEles.length; i++) {
          inputEles[i].setAttribute("class", "column style_normal");
        }
      }
    }
  }

  addInputField = () => {
    const newDivWrap = document.createElement("div");
    newDivWrap.setAttribute("class", "field");
    const inputF = document.createElement("input");
    inputF.setAttribute("type", "text");
    const statusLabel = this.getAttribute("alert");

    if (statusLabel === "true") {
      inputF.setAttribute("class", "column style_alert");
    } else {
      inputF.setAttribute("class", "column style_normal");
    }
    newDivWrap.appendChild(inputF);

    return newDivWrap;
  };
}
// Define the new element
customElements.define("wrap-multiline-field", WrapMultiField);
