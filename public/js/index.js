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

var jsonFile = new Array();

fetch(myRequest).then(function (response) {
    var contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    throw new TypeError("Oops, we haven't got JSON!");
})
    .then(function (json) {
        jsonFile = json;
        generateForm(json, 0);
    })
    .catch(function (error) { console.log(error); });

// define root element which hold all custome elements.
var rootEle = document.getElementById('areaForm');

// function which generate the form user input information.
function generateForm(jsonSetting, numArray) {
    if (jsonSetting.sections.length > numArray) {
        var childElement = document.createElement(jsonSetting.sections[numArray].component);
        childElement.setAttributeNS(null, 'nameTitle', jsonSetting.sections[numArray].title);
        childElement.setAttributeNS(null, 'descShort', jsonSetting.sections[numArray].description);
        childElement.setAttributeNS(null, 'hiddenTitle', jsonSetting.sections[numArray].hidden_title);
        childElement.setAttributeNS(null, 'class', 'infoBox');
        childElement.setAttributeNS(null, 'id', convertToId(jsonSetting.sections[numArray].title));

        rootEle.appendChild(childElement);
        generateForm(jsonSetting, ++numArray);
    } else {
        console.log("Finish read read_sections");
    }
}

document.getElementById('sub').addEventListener('click', function () {
    var eleS2 = document.getElementsByClassName('infoBox'); //Extract all custom element
    // console.log(eleS2)
    var jsOb = new Object();
    jsOb.repository_url = "https://hacknock.com";
    jsOb.project_icon = "hogehoge.ico";
    // console.log("json object is");
    // console.log(jsOb);
    var aS = generateJson(eleS2, jsonFile, 0);
    // console.log("Array is ");
    // console.log(aS);
    jsOb.sections = aS;
    console.log(jsOb);
})

function generateJson(listEle, jsonSetting, numArray) {
    var arrayS = new Array();
    var jsonChild = new Object();
    var arrayChild = new Array();
    if (typeof jsonSetting.sections[numArray] === "undefined") {
        // console.log('finished');
        // console.log(arrayS);
    } else {
        if (listEle[numArray].shadowRoot.querySelector('.field').type === "text") {
            // console.log(listEle[numArray].shadowRoot.querySelector('h2').textContent);
            // console.log(listEle[numArray].shadowRoot.querySelector('.field').value);
            arrayChild.push(listEle[numArray].shadowRoot.querySelector('.field').value);
            jsonChild.title = listEle[numArray].shadowRoot.querySelector('h2').textContent;
            jsonChild.value = arrayChild;
            arrayS.push(jsonChild);
        } else if (listEle[numArray].shadowRoot.querySelector('.field').type === "radio") {
            // console.log(listEle[numArray].shadowRoot.querySelector('h2').textContent);
            // console.log(listEle[numArray].shadowRoot.querySelectorAll('.field')[0].checked);
            // console.log(listEle[numArray].shadowRoot.querySelectorAll('.field')[1].checked);
            arrayChild.push(listEle[numArray].shadowRoot.querySelectorAll('.field')[0].checked);
            arrayChild.push(listEle[numArray].shadowRoot.querySelectorAll('.field')[0].checked);
            jsonChild.title = listEle[numArray].shadowRoot.querySelector('h2').textContent;
            jsonChild.value = arrayChild;
            arrayS.push(jsonChild);
        }
        arrayS = arrayS.concat(generateJson(listEle, jsonSetting, ++numArray));
    }
    return arrayS;
}

function convertToId(title) {
    // console.log(title)
    // console.log(title.replace(' ', '_'));
    return title.replace(' ', '_');
}