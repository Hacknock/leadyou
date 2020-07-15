const form = document.getElementById("generateForm");

// フォームの submit イベントを乗っ取ります
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = form.elements["url"].value;
  const autoFill = form.elements["autoFill"].checked;
  if (url.length === 0) {
    console.log("url is empty");
    return;
  }
  // githubのurl以外がきたら弾く
  const splitUrl = url.split("/");
  if (!url.startsWith("https://github.com/") || splitUrl.length < 5) {
    console.log("url is not github repository");
    return;
  }
  const owner = splitUrl[3];
  const repo = splitUrl[4];
  // console.log(`?owner=${owner}&repo=${repo}&autofill=${autoFill}`);
  window.location.href = `/makereadme?owner=${owner}&repo=${repo}&autofill=${autoFill}`;
});
