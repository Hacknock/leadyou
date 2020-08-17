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
    const description = document.createElement("span");
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
    .shortDescription {
      display: inline-block;
      margin: 0px auto 15px;
      max-width: 80%;
      text-align: left;
      hyphens: auto;
    }

    textarea {
        width: 80%;
        height: 160px;
        resize: vertical;
    }

    input[type=button] {
      margin-top: 10px;
      padding: 3px 8px;
      color: #ECEFF1;
      border: none;
      border-radius: 4px;
      cursor: pointer;
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

    .deleteButton {
      margin-left: 8px;
      background-color: #F44336;
    }

    .display_delete {
      display: inline-block;
    }

    .no_display_delete {
      display: none;
    }

    #addButton {
      background-color: #00897B;
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
    return [
      "nameTitle",
      "descShort",
      "multiple",
      "alert",
      "values",
      "place_holder",
      "maxlength",
    ];
  }

  attributeChangedCallback(attr, _, newVal) {
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
    } else if (attr === "values") {
      const values = JSON.parse(newVal);
      let count = 0;
      this.autoFill(values, this.getAttribute("multiple"), count);
    } else if (attr === "place_holder") {
      let allInputElement = this.shadowRoot.querySelectorAll(".column");
      for (let i = 0; i < allInputElement.length; i++) {
        allInputElement[i].setAttribute("placeholder", newVal);
      }
    } else if (attr === "maxlength") {
      if (typeof newVal !== "undefined") {
        let allInputElement = this.shadowRoot.querySelectorAll(".column");
        for (let i = 0; i < allInputElement.length; i++) {
          allInputElement[i].setAttribute("maxlength", newVal);
        }
      }
    }
  }

  autoFill(values) {
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
  }

  deleteField(e) {
    e.target.parentNode.remove();
    let listField = this.shadowRoot.querySelectorAll(".field");
    if (this.getAttribute("multiple") === "true" && listField.length < 2) {
      const listDeleteButton = this.shadowRoot.querySelectorAll(
        ".deleteButton"
      );
      console.log("listDeleteButton");
      console.log(listDeleteButton);
      for (let i = 0; i < listDeleteButton.length; i++) {
        listDeleteButton[i].setAttribute(
          "class",
          "deleteButton no_display_delete"
        );
      }
    }
  }

  addInputField() {
    const newDivWrap = document.createElement("div");
    newDivWrap.setAttribute("class", "field");
    const inputF = document.createElement("textarea");
    inputF.setAttribute("type", "text");

    inputF.setAttribute("placeholder", this.getAttribute("place_holder"));

    // 今度確認する（今、multilineにaddがないから）
    const maxlength = this.getAttribute("maxlength");
    if (typeof newVal !== "undefined") {
      console.log(maxlength);
      if (Number(maxlength) > 0) {
        let allInputElement = this.shadowRoot.querySelectorAll(".column");
        for (let i = 0; i < allInputElement.length; i++) {
          allInputElement[i].setAttribute("maxlength", Number(maxlength));
        }
      }
    }
    const statusLabel = this.getAttribute("alert");

    // delete button add
    const deleteButton = document.createElement("input");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("value", "delete");
    deleteButton.addEventListener("click", (e) => {
      this.deleteField(e);
    });
    let listField = this.shadowRoot.querySelectorAll(".field");
    if (this.getAttribute("multiple") === "true" && listField.length > 0) {
      deleteButton.setAttribute("class", "deleteButton display_delete");

      const listDeleteButton = this.shadowRoot.querySelectorAll(
        ".deleteButton"
      );
      console.log("listDeleteButton");
      console.log(listDeleteButton);
      for (let i = 0; i < listDeleteButton.length; i++) {
        listDeleteButton[i].setAttribute(
          "class",
          "deleteButton display_delete"
        );
      }
    } else {
      deleteButton.setAttribute("class", "deleteButton no_display_delete");
    }

    if (statusLabel === "true") {
      inputF.setAttribute("class", "column style_alert");
    } else {
      inputF.setAttribute("class", "column style_normal");
    }

    newDivWrap.appendChild(inputF);
    newDivWrap.appendChild(deleteButton);

    return newDivWrap;
  }
}
// Define the new element
customElements.define("wrap-multiline-field", WrapMultiField);
