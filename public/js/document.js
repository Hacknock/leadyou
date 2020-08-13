const getQueryStringParams = (query) => {
  const hoge = /^[?#]/.test(query) ? query.slice(1) : query;
  return hoge.split("&").reduce((params, param) => {
    let [key, value] = param.split("=");
    params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
    return params;
  }, {});
};

const getMarkdown = async (url, inspector) => {
  const options = {
    mode: "cors",
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  };
  try {
    return await fetch(url, options);
  } catch (error) {
    throw error;
  }
};

const loadMarkdown = async () => {
  const params = getQueryStringParams(window.location.search);
  if (!("page" in params)) {
    alert("そんなページないよ！！");
    return;
  }
};
