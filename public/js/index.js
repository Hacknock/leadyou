// Control general acrivity on index.html

// Get setting.json which describe the layout of input form
var myHeaders = new Headers();

var myInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default'
};

var myRequest = new Request('/src/json/setting.json', myInit);

fetch(myRequest).then(function (response) {
    var contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    throw new TypeError("Oops, we haven't got JSON!");
})
    .then(function (json) {
        console.log(json.readme_sections.length);
        generateForm(json, 0);
    })
    .catch(function (error) { console.log(error); });

// define root element which hold all custome elements.
var rootEle = document.getElementById('areaForm');

// function which generate the form user input information.
function generateForm(jsonSetting, numArray) {
    console.log(numArray);
    if (jsonSetting.readme_sections.length > numArray) {
        var childElement = document.createElement(jsonSetting.readme_sections[numArray].component);
        childElement.setAttributeNS(null, 'nameTitle', jsonSetting.readme_sections[numArray].title);
        childElement.setAttributeNS(null, 'descShort', jsonSetting.readme_sections[numArray].description);
        childElement.setAttributeNS(null, 'hiddenTitle', jsonSetting.readme_sections[numArray].hidden_title);

        rootEle.appendChild(childElement);
        console.log(jsonSetting.readme_sections[numArray]);
        generateForm(jsonSetting, ++numArray);
    } else {
        console.log("Finish read read_sections");
    }
}

