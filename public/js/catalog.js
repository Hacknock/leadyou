const catalogArea = document.getElementById("catalog-area");

const getStylesheet = () => {
  return fetch("/src/css/marked.css").then((res) => {
    return res.text();
  });
};

const getGeneratedReadmes = () => {
  const options = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };
  return fetch("/getlist", options)
    .then((res) => res.json())
    .then((json) => {
      let promises = [];
      for (let i = 0; i < json.length; i++) {
        const path = `${json.list[i].user}/${json.list[i].repo}`;
        promises.push(
          fetch(`https://raw.githubusercontent.com/${path}/master/README.md`)
            .then((res) => res.text())
            .then((text) => {
              return { path: path, text: text };
            })
            .catch((err) => {
              console.error(err);
            })
        );
      }
      return Promise.all(promises);
    })
    .then((res) => {
      return res;
    });
};

const convertRelativeToAbsolute = (path, md) => {
  let text = md;
  const regex = /http(s)?:\/\/.+/;
  const array = text.match(/\[([^\[\]\(\)]*?)\]\(([^\[\]\(\)]*?)\)/g);
  for (const tag of array) {
    const item = tag.match(/^\[.*?\]\((.*?)\)$/)[1];
    if (regex.test(item)) {
      const newTag = tag.replace(
        `://github.com/${path}/blob/master/`,
        `://github.com/${path}/raw/master/`
      );
      text = text.replace(tag, newTag);
    } else {
      const after = item.match(/^\.*\/*(.+)/)[1];
      const newTag = tag.replace(
        item,
        `https://github.com/${path}/raw/master/${after}`
      );
      text = text.replace(tag, newTag);
    }
  }
  return text;
};

(() => {
  Promise.all([getStylesheet(), getGeneratedReadmes()])
    .then(([stylesheet, list]) => {
      list.forEach(({ path, text }) => {
        if (text.indexOf("<!-- CREATED_BY_LEADYOU_README_GENERATOR -->") < 0)
          return;

        const div = document.createElement("div");
        div.setAttribute("class", "readme");

        const wrapDiv = document.createElement("div");
        wrapDiv.setAttribute("class", "wrap-iframe");

        const newText = convertRelativeToAbsolute(path, text);
        let html = `<html><head><style>${stylesheet}</style></head><body>`;
        html += `<div class="md-content">${marked(
          newText
        )}</div></body></html>`;
        const blob = new Blob([html], { type: "text/html" });
        const iframe = document.createElement("iframe");
        iframe.setAttribute("title", path);
        iframe.src = URL.createObjectURL(blob);

        const p = document.createElement("p");
        const img = document.createElement("img");
        img.src = "/src/images/github-icon.png";
        const a = document.createElement("a");
        a.href = `https://github.com/${path}`;
        a.innerText = path;

        div.appendChild(wrapDiv);
        wrapDiv.appendChild(iframe);
        p.appendChild(img);
        p.appendChild(a);
        div.appendChild(p);
        catalogArea.appendChild(div);
      });
    })
    .catch((err) => {
      console.error(err);
    });
})();
