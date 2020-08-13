const outputEle = document.getElementById("documentArea");

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
      throw new Error("404 とかで md がないよ");
    }
  } catch (err) {
    throw err;
  }
};

const loadMarkdown = () => {
  const params = getQueryStringParams(window.location.search);
  if (!("md" in params)) {
    console.error(new Error("query に md がないよ"));
    alert("query に md がないよ");
  }
  getMarkdown(`/src/md/${params.md}.md`)
    .then((md) => {
      outputEle.innerHTML = marked(md);
    })
    .catch((err) => {
      console.error(err);
      // ページがなかった時の処理を何かする。
      alert("ページがなかったよ");
    });
};

loadMarkdown();
