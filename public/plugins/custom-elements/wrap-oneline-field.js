/**
 * Copyright 2020 Hacknock
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class WrapOnelineField extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    //Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Create sections
    const wrapper = this.addInputField();

    // Create title holder
    const blockSubTitle = document.createElement("div");
    blockSubTitle.setAttribute("class", "block-subtitle");
    const subtitle = document.createElement("span");
    subtitle.setAttribute("class", "sub-title");
    const titleSub = this.getAttribute("name-title");
    subtitle.textContent = titleSub;
    const markRequired = document.createElement("span");
    markRequired.setAttribute("class", "mark-required display-optional");
    markRequired.textContent = "*";
    blockSubTitle.appendChild(subtitle);
    blockSubTitle.appendChild(markRequired);

    // Create description holder
    const description = document.createElement("span");
    description.setAttribute("class", "short-description");
    const descShort = this.getAttribute("desc-short");
    description.textContent = descShort;

    const spanMaxlength = document.createElement("span");
    const valueMaxlength = spanMaxlength.getAttribute(
      "class",
      "show-maxlength"
    );
    if (valueMaxlength !== null)
      description.textContent = `${descShort} (in ${valueMaxlength} characters or less)`;

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");
    style.textContent = `
    .short-description {
      display: inline-block;
      margin: 0px auto 15px;
      max-width: 80%;
      text-align: left;
      hyphens: auto;
    }

    input[type=text] {
      width: 60%;
      padding: 3px;
    }

    input[type=button] {
      margin-top: 10px;
      padding: 3px 8px;
      color: #ECEFF1;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }

    .style-alert {
      border: solid 0.7px #E53935;
    }

    .style-normal {
      border: solid 0.7px #000000;
    }

    .delete-button {
      margin-left: 8px;
      background-color: #F44336;
    }

    .display-delete {
      display: inline-block;
    }

    .no-display-delete {
      display: none;
    }

    #add-button {
      background-color: #00897B;
    }

    .block-subtitle {
      margin: 0.83em 0;
      font-size: 1.5em;
    }

    .display-optional {
      display: none;
    }

    .display-required {
      color: #F44336;
      margin-left: 4px;
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
    shadow.appendChild(blockSubTitle);
    shadow.appendChild(description);
    shadow.appendChild(wrapper);

    if (this.getAttribute("multiple") === true) {
      shadow.appendChild(addButton);
    }
  }

  static get observedAttributes() {
    return [
      "name-title",
      "desc-short",
      "multiple",
      "alert",
      "values",
      "placeholder",
      "maxlength",
      "required",
    ];
  }

  attributeChangedCallback(attr, _, newVal) {
    if (attr === "name-title") {
      // Create title holder
      this.shadowRoot.querySelector(".sub-title").textContent = newVal;
    } else if (attr === "desc-short") {
      // Create description holder
      this.shadowRoot.querySelector(".short-description").textContent = newVal;
    } else if (attr === "multiple" && newVal === "true") {
      const addButton = document.createElement("input");
      addButton.setAttribute("type", "button");
      addButton.setAttribute("value", "add");
      addButton.setAttribute("id", "add-button");
      addButton.addEventListener("click", () => {
        const newDivWrap = this.addInputField();

        this.shadowRoot.insertBefore(newDivWrap, addButton);
      });
      this.shadowRoot.appendChild(addButton);
    } else if (attr === "alert") {
      let inputEles = this.shadowRoot.querySelectorAll(".column");
      if (newVal === "true") {
        for (var i = 0; i < inputEles.length; i++) {
          inputEles[i].setAttribute("class", "column style-alert");
        }
      } else {
        for (var i = 0; i < inputEles.length; i++) {
          inputEles[i].setAttribute("class", "column style-normal");
        }
      }
    } else if (attr === "values") {
      const values = JSON.parse(newVal);
      let count = 0;
      this.autoFill(values, this.getAttribute("multiple"), count);
    } else if (attr === "placeholder") {
      let allInputElement = this.shadowRoot.querySelectorAll(".column");
      for (let i = 0; i < allInputElement.length; i++) {
        allInputElement[i].setAttribute("placeholder", newVal);
      }
    } else if (attr === "maxlength") {
      const descEle = this.shadowRoot.querySelector(".short-description");
      let desc = descEle.textContent;
      const valueMaxlength = newVal;
      descEle.textContent = `${desc} (in ${valueMaxlength} characters or less)`;
      if (typeof newVal !== "undefined") {
        let allInputElement = this.shadowRoot.querySelectorAll(".column");
        for (let i = 0; i < allInputElement.length; i++) {
          allInputElement[i].setAttribute("maxlength", newVal);
        }
      }
    } else if (attr === "required") {
      if (newVal === "true") {
        let allMarks = this.shadowRoot.querySelectorAll(".mark-required");
        for (let i = 0; i < allMarks.length; i++) {
          allMarks[i].setAttribute("class", "mark-required display-required");
        }
      }
    }
  }

  autoFill(values) {
    let inputEles = this.shadowRoot.querySelectorAll(".column");
    const addButton = this.shadowRoot.getElementById("add-button");
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
  }

  deleteField(e) {
    e.target.parentNode.remove();
    let listField = this.shadowRoot.querySelectorAll(".field");
    if (this.getAttribute("multiple") === "true" && listField.length < 2) {
      const listDeleteButton = this.shadowRoot.querySelectorAll(
        ".delete-button"
      );
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
    newDivWrap.setAttribute("class", "field");
    const newInputF = document.createElement("input");
    newInputF.setAttribute("type", "text");
    newInputF.setAttribute("maxlength", 140);

    const statusLabel = this.getAttribute("alert");

    newInputF.setAttribute("placeholder", this.getAttribute("placeholder"));

    // delete button add
    // Judge whether this inserts delte button or not
    const deleteButton = document.createElement("input");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("value", "delete");
    deleteButton.addEventListener("click", (e) => {
      this.deleteField(e);
    });
    let listField = this.shadowRoot.querySelectorAll(".field");
    if (this.getAttribute("multiple") === "true" && listField.length > 0) {
      deleteButton.setAttribute("class", "delete-button display-delete");

      const listDeleteButton = this.shadowRoot.querySelectorAll(
        ".delete-button"
      );
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
      newInputF.setAttribute("class", "column style-alert");
    } else {
      newInputF.setAttribute("class", "column style-normal");
    }
    newDivWrap.appendChild(newInputF);
    newDivWrap.appendChild(deleteButton);
    if (typeof newVal !== "undefined") {
      const maxlength = this.getAttribute("maxlength");
      if (Number(maxlength) > 0) {
        let allInputElement = this.shadowRoot.querySelectorAll(".column");
        for (let i = 0; i < allInputElement.length; i++) {
          allInputElement[i].setAttribute("maxlength", Number(maxlength));
        }
      }
    }
    return newDivWrap;
  }
}

// Define the new element
customElements.define("wrap-oneline-field", WrapOnelineField);
