const form = document.getElementById("generate-form");

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
    document
      .getElementById("url-column")
      .setAttribute("class", "url alert-repo");
    document.getElementById("alert-text").textContent =
      "This repository is a private repository or does not exist.";
    // console.log("url is not github repository");
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
      document
        .getElementById("url-column")
        .setAttribute("class", "url alert-repo");
      document.getElementById("alert-text").textContent =
        "This repository is a private repository or does not exist.";
    });
});

const getTextLength = () => {
  if (document.getElementById("url-column").value.length > 0) {
    document.getElementById("auto-fill").removeAttribute("disabled");
  } else if (document.getElementById("url-column").value.length === 0) {
    document.getElementById("auto-fill").setAttribute("disabled", "disabled");
  }
};

document.getElementById("url-column").addEventListener("input", getTextLength);
