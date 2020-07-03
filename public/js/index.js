// Control general acrivity on index.html

// Get setting.json which describe the layout of input form
var myHeaders = new Headers();

var myInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default'
};

var myRequest = new Request('/src/json/template.json', myInit);

fetch(myRequest).then(function (response) {
    var contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    throw new TypeError("Oops, we haven't got JSON!");
})
    .then(function (json) {
        console.log(json.sections.length);
        generateForm(json, 0);
    })
    .catch(function (error) { console.log(error); });

// define root element which hold all custome elements.
var rootEle = document.getElementById('areaForm');

// function which generate the form user input information.
function generateForm(jsonSetting, numArray) {
    console.log(numArray);
    if (jsonSetting.sections.length > numArray) {
        var childElement = document.createElement(jsonSetting.sections[numArray].component);
        childElement.setAttributeNS(null, 'nameTitle', jsonSetting.sections[numArray].title);
        childElement.setAttributeNS(null, 'descShort', jsonSetting.sections[numArray].description);
        childElement.setAttributeNS(null, 'hiddenTitle', jsonSetting.sections[numArray].hidden_title);
        childElement.setAttributeNS(null, 'class', 'infoBox');

        rootEle.appendChild(childElement);
        console.log(jsonSetting.sections[numArray]);
        generateForm(jsonSetting, ++numArray);
    } else {
        console.log("Finish read read_sections");
    }
}

document.getElementById('sub').addEventListener('click', function () {
    var eleS2 = document.getElementsByClassName('infoBox'); //Extract all custom element

    console.log(eleS2[1].shadowRoot.querySelectorAll('.field')[0].checked)
    // console.log(eleS2[0].shadowRoot.getElementById('field').value);
    // console.log(eleS2[0].shadowRoot.querySelector('.field').value);

})

