class WrapRadio extends HTMLElement {
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
    const hiddenTitle = this.getAttribute("hiddenTitle");
    subtitle.textContent = titleSub;

    // Create description holder
    const description = document.createElement("p");
    description.setAttribute("class", "shortDescription");
    const descShort = this.getAttribute("descShort");
    description.textContent = descShort;

    // add column button
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
    
    .style_alert {
      border: solid 0.7px #f00;
    }

    .style_normal {
      border: none;
    }

    `;

    // console.log('hidden title', hiddenTitle)

    if (hiddenTitle) {
      style.textContent =
        style.textContent +
        `
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
    if (this.getAttribute("multiple") === true) {
      shadow.appendChild(addButton);
    }
  }

  static get observedAttributes() {
    return ["nameTitle", "hiddenTitle", "descShort", "multiple", "alert"];
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
    } else if (attr === "hiddenTitle") {
      // console.log('hidden title nyao');
      this.updateStyle(this);
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

  updateStyle(elem) {
    var shadow = elem.shadowRoot;
    var childNodes = shadow.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
      if (childNodes[i].nodeName === "STYLE") {
        childNodes[i].textContent += `
                h2 {
                    display: none;
                }
            `;
      }
    }
  }

  addInputField = () => {
    const newDivWrap = document.createElement("div");
    const radioY = document.createElement("input");
    const labelY = document.createElement("label");
    const radioN = document.createElement("input");
    const labelN = document.createElement("label");
    const subject = this.getAttribute("subject");
    radioY.setAttribute("type", "radio");
    radioY.setAttribute("name", subject);
    radioY.setAttribute("value", "Yes");
    radioY.setAttribute("class", "column");
    labelY.textContent = "Yes";
    radioN.setAttribute("type", "radio");
    radioN.setAttribute("name", subject);
    radioN.setAttribute("value", "No");
    radioN.setAttribute("class", "column");
    labelN.innerText = "No";

    const statusLabel = this.getAttribute("alert");

    if (statusLabel === "true") {
      newDivWrap.setAttribute("class", "field style_alert");
    } else {
      newDivWrap.setAttribute("class", "field style_normal");
    }

    newDivWrap.appendChild(radioY);
    newDivWrap.appendChild(labelY);
    newDivWrap.appendChild(radioN);
    newDivWrap.appendChild(labelN);
    return newDivWrap;
  };
}
// Define the new element
customElements.define("wrap-radio", WrapRadio);
