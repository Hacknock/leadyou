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
    const divWrap = addInputField();

    const addButton = document.createElement("input");

    addButton.setAttribute("type", "button");
    addButton.setAttribute("value", "add");
    addButton.addEventListener("click", () => {
      const newDivWrap = addInputField();

      shadow.insertBefore(newDivWrap, addButton);
    });

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");
    // console.log(style.isConnected);
    style.textContent = ``;

    // Append Child
    shadow.appendChild(style);
    shadow.appendChild(subtitle);
    shadow.appendChild(description);
    shadow.appendChild(divWrap);
    shadow.appendChild(addButton);
  }

  static get observedAttributes() {
    return ["nameTitle", "descShort"];
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
    }
  }
}

const addInputField = () => {
  const newDivWrap = document.createElement("div");
  newDivWrap.setAttribute("class", "field");
  const newUpFile = document.createElement("input");
  newUpFile.setAttribute("type", "file");
  newUpFile.setAttribute("name", "image");
  newUpFile.setAttribute("class", "column");
  const newDescFile = document.createElement("input");
  newDescFile.setAttribute("type", "text");
  newDescFile.setAttribute("name", "text");
  newDescFile.setAttribute("class", "column");
  newDivWrap.appendChild(newUpFile);
  newDivWrap.appendChild(newDescFile);

  return newDivWrap;
};

// Define the new element
customElements.define("wrap-upload-file", WrapUploadFile);
