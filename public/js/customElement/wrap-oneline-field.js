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

    .display_delete {
      display: inline-block;
    }

    .no_display_delete {
      display: none;
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
    return [
      "nameTitle",
      "descShort",
      "multiple",
      "alert",
      "values",
      "place_holder",
    ];
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
    } else if (attr === "place_holder") {
      let allInputElement = this.shadowRoot.querySelectorAll(".column");
      for (let i = 0; i < allInputElement.length; i++) {
        allInputElement[i].setAttribute("placeholder", newVal);
      }
    }
  }

  autoFill = (values, multiple, count) => {
    let inputEles = this.shadowRoot.querySelectorAll(".column");
    const addButton = this.shadowRoot.getElementById("addButton");
    for (const [i, v] of values.entries()) {
      if (inputEles.length > i) {
        inputEles[i].value = v;
      } else {
        const newDivWrap = this.addInputField();
        this.shadowRoot.insertBefore(newDivWrap, addButton);
        inputEles = this.shadowRoot.querySelectorAll(".column");
        inputEles[i].value = v;
      }
    }
  };

  deleteField = (e) => {
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
  };

  addInputField = () => {
    const newDivWrap = document.createElement("div");
    newDivWrap.setAttribute("class", "field");
    const newInputF = document.createElement("input");
    newInputF.setAttribute("type", "text");
    newInputF.setAttribute("maxlength", 140);

    const statusLabel = this.getAttribute("alert");

    // delete button add
    // Judge whether this inserts delte button or not
    const deleteButton = document.createElement("input");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("value", "delete");
    deleteButton.addEventListener("click", this.deleteField);
    let listField = this.shadowRoot.querySelectorAll(".field");
    if (this.getAttribute("multiple") === "true" && listField.length > 0) {
      deleteButton.setAttribute("class", "deleteButton display_delete");

      const listDeleteButton = this.shadowRoot.querySelectorAll(
        ".deleteButton"
      );
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
      newInputF.setAttribute("class", "column style_alert");
    } else {
      newInputF.setAttribute("class", "column style_normal");
    }
    newDivWrap.appendChild(newInputF);
    newDivWrap.appendChild(deleteButton);

    return newDivWrap;
  };
}

// Define the new element
customElements.define("wrap-oneline-field", WrapOnelineField);
