class WrapUploadFile extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    //Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Create title holder
    const subtitle = document.createElement("h2");
    subtitle.setAttribute("class", "sub-title");
    const titleSub = this.getAttribute("name-title");
    subtitle.textContent = titleSub;

    // Create description holder
    const description = document.createElement("span");
    description.setAttribute("class", "short-description");
    const descShort = this.getAttribute("desc-short");
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
    .short-description {
      display: inline-block;
      margin: 0px auto 15px;
      max-width: 80%;
      text-align: left;
      hyphens: auto;
    }

    .field {
      padding: 10px 0px;
      text-align: left;
    }

    input[type=file] {
      margin-bottom: 10px;
      margin-left: 10%;
    }

    textarea {
      margin-left: 10%;
      width: 80%;
      height: 160px;
      resize: vertical;
    }

    input[type=text] {
      margin-top: 10px;
      width: 80%;
      height: 160px;
    }

    input[type=button] {
      margin-top: 10px;
      padding: 3px 8px;
      color: #ECEFF1;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .style-alert {
      border: solid 0.7px #E53935;
    }

    .style-normal {
      border: none;
    }

    #data-id {
      display: none;
    }

    .delete-button {
      margin-left: auto;
      margin-right: calc(10% - 5px);
      background-color: #F44336;
    }

    .display-delete {
      display: block;
    }

    .no-display-delete {
      display: none;
    }

    #add-button {
      background-color: #00897B;
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
    return [
      "name-title",
      "desc-short",
      "multiple",
      "alert",
      "placeholder",
      "maxlength",
      "kindsOfFile",
    ];
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
    } else if (attr === "placeholder") {
      let allInputElement = this.shadowRoot.querySelectorAll(".column");
      for (let i = 0; i < allInputElement.length; i++) {
        if (allInputElement[i].getAttribute("type") === "text") {
          allInputElement[i].setAttribute("placeholder", newVal);
        }
      }
    } else if (attr === "maxlength") {
      if (typeof newVal !== "undefined") {
        const textareas = this.shadowRoot.querySelectorAll("textarea");
        textareas.forEach((element) =>
          element.setAttribute("maxlength", newVal)
        );
      }
    } else if (attr === "kindsOfFile") {
      console.log("kindsOfFile");
      console.log(newVal);
      const inputFiles = this.shadowRoot.querySelectorAll("input");
      console.log(inputFiles);
      inputFiles.forEach((element) => {
        console.log(element);
        if (element.getAttribute("type") === "file") {
          element.setAttribute("accept", newVal);
        }
      });
    }
  }
  handleFileSelect(e) {
    var fileList = e.target.files;
    var blobUrl = window.URL.createObjectURL(fileList[0]);
    let childrenThisField = e.target.parentNode.children;

    for (let i = 0; i < childrenThisField.length; i++) {
      if (childrenThisField[i].getAttribute("id") === "data-id") {
        childrenThisField[i].value = blobUrl;
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
    const newUpFile = document.createElement("input");
    newUpFile.setAttribute("type", "file");
    newUpFile.setAttribute("name", "image");
    // newUpFile.setAttribute("class", "column");
    const labelFile = document.createElement("input");
    labelFile.setAttribute("class", "column");
    labelFile.setAttribute("id", "data-id");

    newUpFile.addEventListener("change", (e) => {
      this.handleFileSelect(e);
    });

    const newBR = document.createElement("br");
    const newDescFile = document.createElement("textarea");
    newDescFile.setAttribute("type", "text");
    newDescFile.setAttribute("name", "text");
    newDescFile.setAttribute("class", "column");

    newDescFile.setAttribute("placeholder", this.getAttribute("placeholder"));

    const statusLabel = this.getAttribute("alert");
    if (typeof newVal !== "undefined") {
      const maxlength = this.getAttribute("maxlength");
      newDescFile.setAttribute("maxlength", maxlength);
      const textareas = this.shadowRoot.querySelectorAll("textarea");
      textareas.forEach((element) =>
        element.setAttribute("maxlength", maxlength)
      );
    }

    // delete button add
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

    newDivWrap.appendChild(newUpFile);
    newDivWrap.appendChild(labelFile);
    newDivWrap.appendChild(newBR);
    newDivWrap.appendChild(newDescFile);
    newDivWrap.appendChild(deleteButton);

    return newDivWrap;
  }
}

// Define the new element
customElements.define("wrap-upload-file", WrapUploadFile);
