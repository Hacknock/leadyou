class WrapOnelineField extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    //Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Create sections
    const wrapper = this.addInputField();

    // Create title holder
    const subtitle = document.createElement("h2");
    subtitle.setAttribute("class", "subTitle");
    const titleSub = this.getAttribute("nameTitle");
    subtitle.textContent = titleSub;

    // Create description holder
    const description = document.createElement("p");
    description.setAttribute("class", "shortDescription");
    const descShort = this.getAttribute("descShort");
    description.textContent = descShort;

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");
    // console.log(style.isConnected);
    style.textContent = `
    input[type=text] {
      width: 60%;
    }

    input[type=button] {
      margin-top: 10px;
    }

    .style_alert {
      border: solid 0.7px #E53935;
    }

    .style_normal {
      border: solid 0.7px #000000;
    }
    `;

    // add input field button & its event
    const addButton = document.createElement("input");
    addButton.setAttribute("type", "button");
    addButton.setAttribute("value", "add");
    addButton.addEventListener("click", () => {
      const newDivWrap = this.addInputField();

      shadow.insertBefore(newDivWrap, addButton);
    });

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
    return ["nameTitle", "descShort", "multiple", "alert", "values"];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
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
      addButton.setAttribute("id", "addButton");
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
    } else if (attr === "values") {
      const values = JSON.parse(newVal);
      let count = 0;
      this.autoFill(values, this.getAttribute("multiple"), count);
    }
  }

  autoFill = (values, multiple, count) => {
    // console.log(multiple);
    let inputEles = this.shadowRoot.querySelectorAll(".column");
    const addButton = this.shadowRoot.getElementById("addButton");
    // console.log(values);
    for (const [i, v] of values.entries()) {
      if (inputEles.length > i) {
        inputEles[i].value = v;
      } else {
        const newDivWrap = this.addInputField();
        this.shadowRoot.insertBefore(newDivWrap, addButton);
        inputEles = this.shadowRoot.querySelectorAll(".column");
        // console.log(inputEles[i]);
        inputEles[i].value = v;
      }
    }
  };

  addInputField = () => {
    const newDivWrap = document.createElement("div");
    newDivWrap.setAttribute("class", "field");
    const newInputF = document.createElement("input");
    newInputF.setAttribute("type", "text");
    newInputF.setAttribute("maxlength", 140);

    const statusLabel = this.getAttribute("alert");

    if (statusLabel === "true") {
      newInputF.setAttribute("class", "column style_alert");
    } else {
      newInputF.setAttribute("class", "column style_normal");
    }
    newDivWrap.appendChild(newInputF);

    return newDivWrap;
  };
}

// Define the new element
customElements.define("wrap-oneline-field", WrapOnelineField);
