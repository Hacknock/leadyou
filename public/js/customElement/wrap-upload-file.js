class WrapUploadFile extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    //Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

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

    // Create form
    const divWrap = this.addInputField();

    const addButton = document.createElement("input");

    addButton.setAttribute("type", "button");
    addButton.setAttribute("value", "add");
    addButton.addEventListener("click", () => {
      const newDivWrap = this.addInputField();

      shadow.insertBefore(newDivWrap, addButton);
    });

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");
    // console.log(style.isConnected);
    style.textContent = `
    input[type=text] {
      margin-top: 10px;
      width: 80%;
      height: 160px;
    }

    input[type=button] {
      margin-top: 10px;
    }

    .style_alert {
      border: solid 0.7px #E53935;
    }

    .style_normal {
      border: none;
    }
    `;

    // Append Child
    shadow.appendChild(style);
    shadow.appendChild(subtitle);
    shadow.appendChild(description);
    shadow.appendChild(divWrap);
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
      let inputEles = this.shadowRoot.querySelectorAll(".field");
      if (newVal === "true") {
        for (var i = 0; i < inputEles.length; i++) {
          inputEles[i].setAttribute("class", "field style_alert");
        }
      } else {
        for (var i = 0; i < inputEles.length; i++) {
          inputEles[i].setAttribute("class", "field style_normal");
        }
      }
    }
  }
  addInputField = () => {
    const newDivWrap = document.createElement("div");
    const newUpFile = document.createElement("input");
    newUpFile.setAttribute("type", "file");
    newUpFile.setAttribute("name", "image");
    newUpFile.setAttribute("class", "column");
    const newBR = document.createElement("br");
    const newDescFile = document.createElement("input");
    newDescFile.setAttribute("type", "text");
    newDescFile.setAttribute("name", "text");
    newDescFile.setAttribute("class", "column");

    const statusLabel = this.getAttribute("alert");

    if (statusLabel === "true") {
      newDivWrap.setAttribute("class", "field style_alert");
    } else {
      newDivWrap.setAttribute("class", "field style_normal");
    }

    newDivWrap.appendChild(newUpFile);
    newDivWrap.appendChild(newBR);
    newDivWrap.appendChild(newDescFile);

    return newDivWrap;
  };
}

// Define the new element
customElements.define("wrap-upload-file", WrapUploadFile);
