
console.log('test')
// const result = document.getElementById('result');
// const jsonArea = document.getElementById('json');

// window.onload = function () {
//     let json = JSON.parse(jsonArea.innerText);
//     let pretty = JSON.stringify(json, null, 4);
//     result.innerText = pretty;
// };

// custome element test, reference https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
// note: We want make "Autonomous custom elements"

class WordCount extends HTMLParagraphElement {
  constructor() {
    console.log("Hello world-count");
    super();
    console.log("Hello world-count");

  }
}
customElements.define('world-count', WordCount, { extends: 'p' })

//Autonomous custom elements
document.createElement("popup-info");