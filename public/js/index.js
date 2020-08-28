const form = document.getElementById("generate-form");
const urlColumn = document.getElementById("url-column");
const alertText = document.getElementById("alert-text");
const autoFillCheck = document.getElementById("auto-fill");
const counter = document.getElementById("counter");

const options = {
  mode: "cors",
  method: "GET",
  // credentials: "include",
};

// フォームの submit イベントを乗っ取ります
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = form.elements["url"].value;
  const autoFill = form.elements["auto-fill"].checked;
  if (url.length === 0) {
    console.log("url is empty");
    window.location.href = "/makereadme";
    return;
  }
  // githubのurl以外がきたら弾く;
  const splitUrl = url.split("/");
  if (!url.startsWith("https://github.com/") || splitUrl.length < 5) {
    urlColumn.setAttribute("class", "url alert-repo");
    alertText.textContent =
      "This repository is a private repository or does not exist.";
    return;
  }

  const splitRepoUrl = url.split("/");
  if (splitRepoUrl.length < 5)
    return errorPromise("Can not specify the repository with the inputed url.");

  const requestURL = `https://api.github.com/repos/${splitRepoUrl[3]}/${splitRepoUrl[4]}/contributors`;

  fetch(requestURL, options)
    .then((response) => {
      if (response.ok) {
        console.log("Valid URL");
        const owner = splitUrl[3];
        const repo = splitUrl[4];
        console.log(`?owner=${owner}&repo=${repo}&autofill=${autoFill}`);
        window.location.href = `/makereadme?owner=${owner}&repo=${repo}&autofill=${autoFill}`;
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .catch((error) => {
      console.log(
        "There has been a problem with your fetch operation: ",
        error.message
      );
      urlColumn.setAttribute("class", "url alert-repo");
      alertText.textContent =
        "This repository is a private repository or does not exist.";
    });
});

const getTextLength = () => {
  if (urlColumn.value.length > 0) {
    autoFillCheck.removeAttribute("disabled");
  } else if (urlColumn.value.length === 0) {
    autoFillCheck.setAttribute("disabled", "disabled");
  }
};

urlColumn.addEventListener("input", getTextLength);

(function () {
  try {
    fetch("/getcount")
      .then((res) => res.json())
      .then((data) => {
        if (data.result === "success") {
          counter.textContent = ` +${data.count.toLocaleString()}`;
        }
      });
  } catch (error) {
    console.error(error);
  }
})();
