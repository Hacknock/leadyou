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
    input[type=file] {
      margin-bottom: 10px;
    }

    textarea {
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

    .style_alert {
      border: solid 0.7px #E53935;
    }

    .style_normal {
      border: none;
    }

    #dataID {
      display: none;
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
    shadow.appendChild(divWrap);
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
      "place_holder",
      "maxlength",
      "kinds_of_file",
    ];
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
      addButton.setAttribute("id", "addButton");
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
    } else if (attr === "place_holder") {
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
    } else if (attr === "kinds_of_file") {
      console.log("kinds_of_file");
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
      if (childrenThisField[i].getAttribute("id") === "dataID") {
        childrenThisField[i].value = blobUrl;
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
    const newUpFile = document.createElement("input");
    newUpFile.setAttribute("type", "file");
    newUpFile.setAttribute("name", "image");
    // newUpFile.setAttribute("class", "column");
    const labelFile = document.createElement("input");
    labelFile.setAttribute("class", "column");
    labelFile.setAttribute("id", "dataID");

    newUpFile.addEventListener("change", this.handleFileSelect);

    const newBR = document.createElement("br");
    const newDescFile = document.createElement("textarea");
    newDescFile.setAttribute("type", "text");
    newDescFile.setAttribute("name", "text");
    newDescFile.setAttribute("class", "column");

    newDescFile.setAttribute("placeholder", this.getAttribute("place_holder"));

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
    deleteButton.addEventListener("click", this.deleteField);
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
      newDivWrap.setAttribute("class", "field style_alert");
    } else {
      newDivWrap.setAttribute("class", "field style_normal");
    }

    newDivWrap.appendChild(newUpFile);
    newDivWrap.appendChild(deleteButton);
    newDivWrap.appendChild(labelFile);
    newDivWrap.appendChild(newBR);
    newDivWrap.appendChild(newDescFile);

    return newDivWrap;
  }
}

// Define the new element
customElements.define("wrap-upload-file", WrapUploadFile);
