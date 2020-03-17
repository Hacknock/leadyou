const countLabel = document.getElementById('countLabel');
const countButton = document.getElementById('countButton');
let count = 0;

function countUp() {
    count += 1;
    countLabel.innerText = count;
}

window.onload = function() {
    countButton.addEventListener('click', countUp, false);
};
