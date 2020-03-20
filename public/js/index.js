const result = document.getElementById('result');
const jsonArea = document.getElementById('json');

window.onload = function() {
    let json = JSON.parse(jsonArea.innerText);
    let pretty = JSON.stringify(json, null, 4);
    result.innerText = pretty;
};
