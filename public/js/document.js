const outputEle = document.getElementById("document-area");

const getQueryStringParams = (query) => {
  const hoge = /^[?#]/.test(query) ? query.slice(1) : query;
  return hoge.split("&").reduce((params, param) => {
    let [key, value] = param.split("=");
    params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
    return params;
  }, {});
};

const getMarkdown = async (url) => {
  const options = {
    mode: "cors",
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  };
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    if (response.ok) {
      return text;
    } else {
      throw new Error(`${url.replace("/src/md/", "")} is not found.`);
    }
  } catch (err) {
    throw err;
  }
};

const loadMarkdown = () => {
  const params = getQueryStringParams(window.location.search);
  if (!("md" in params)) {
    const err = new Error("The page is not specified.");
    console.error(err);
    outputEle.innerHTML = `<p>${err}</p>`;
    return;
  }
  getMarkdown(`/src/md/${params.md}.md`)
    .then((md) => {
      outputEle.innerHTML = marked(md);
    })
    .catch((err) => {
      console.error(err);
      outputEle.innerHTML = `<p>${err}</p>`;
    });
};

loadMarkdown();
