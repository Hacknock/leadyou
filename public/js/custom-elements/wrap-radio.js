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
    subtitle.setAttribute("class", "sub-title");
    const titleSub = this.getAttribute("name-title");
    const hiddenTitle = this.getAttribute("hidden-title");
    subtitle.textContent = titleSub;

    // Create description holder
    const description = document.createElement("span");
    description.setAttribute("class", "short-description");
    const descShort = this.getAttribute("desc-short");
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
    .short-description {
      display: inline-block;
      margin: 0px auto 15px;
      max-width: 80%;
      text-align: left;
      hyphens: auto;
    }

    .style-alert {
      border: solid 0.7px #f00;
    }

    .style-normal {
      border: none;
    }

    .display-delete {
      display: inline-block;
    }

    .no-display-delete {
      display: none;
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
    return ["name-title", "hidden-title", "desc-short", "multiple", "alert"];
  }

  attributeChangedCallback(attr, _, newVal) {
    // console.log('my-el attribute changed', attr);
    // console.log('new value is ', newVal);
    if (attr === "name-title") {
      // Create title holder
      this.shadowRoot.querySelector(".sub-title").textContent = newVal;
    } else if (attr === "desc-short") {
      // Create description holder
      this.shadowRoot.querySelector(".short-description").textContent = newVal;
    } else if (attr === "hidden-title") {
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
          inputEles[i].setAttribute("class", "field style-alert");
        }
      } else {
        for (var i = 0; i < inputEles.length; i++) {
          inputEles[i].setAttribute("class", "field style-normal");
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

  deleteField(e) {
    e.target.parentNode.remove();
    let listField = this.shadowRoot.querySelectorAll(".field");
    if (this.getAttribute("multiple") === "true" && listField.length < 2) {
      const listDeleteButton = this.shadowRoot.querySelectorAll(
        ".delete-button"
      );
      console.log("listDeleteButton");
      console.log(listDeleteButton);
      for (let i = 0; i < listDeleteButton.length; i++) {
        listDeleteButton[i].setAttribute(
          "class",
          "delete-button no-display-delete"
        );
      }
    }
  }

  addInputField() {
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

    // delete button add
    const deleteButton = document.createElement("input");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("value", "delete");
    deleteButton.addEventListener("click", this.deleteField);
    let listField = this.shadowRoot.querySelectorAll(".field");
    if (this.getAttribute("multiple") === "true" && listField.length > 0) {
      deleteButton.setAttribute("class", "delete-button display-delete");

      const listDeleteButton = this.shadowRoot.querySelectorAll(
        ".delete-button"
      );
      console.log("listDeleteButton");
      console.log(listDeleteButton);
      for (let i = 0; i < listDeleteButton.length; i++) {
        listDeleteButton[i].setAttribute(
          "class",
          "delete-button display-delete"
        );
      }
    } else {
      deleteButton.setAttribute("class", "delete-button no-display-delete");
    }

    if (statusLabel === "true") {
      newDivWrap.setAttribute("class", "field style-alert");
    } else {
      newDivWrap.setAttribute("class", "field style-normal");
    }

    newDivWrap.appendChild(radioY);
    newDivWrap.appendChild(labelY);
    newDivWrap.appendChild(radioN);
    newDivWrap.appendChild(labelN);
    newDivWrap.appendChild(deleteButton);

    return newDivWrap;
  }
}
// Define the new element
customElements.define("wrap-radio", WrapRadio);
