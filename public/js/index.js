const form = document.getElementById("generate-form");
const urlColumn = document.getElementById("url-column");
const alertText = document.getElementById("alert-text");
const autoFillCheck = document.getElementById("auto-fill");
const catalogArea = document.getElementById("catalog-area");
const counter = document.getElementById("counter");

// ☆☆☆☆☆ Top Form ☆☆☆☆☆
const showWarning = () => {
  urlColumn.setAttribute("class", "url alert-repo");
  alertText.textContent =
    "This repository is a private repository or does not exist.";
};

const validationURL = () => {
  const url = form.elements["url"].value;
  if (url.length === 0) {
    window.location.href = "/makereadme";
    return;
  }
  const splitUrl = url.split("/");
  if (!url.startsWith("https://github.com/") || splitUrl.length < 5) {
    showWarning();
    return;
  }
  const owner = splitUrl[3];
  const repo = splitUrl[4];
  const requestURL = `https://api.github.com/repos/${owner}/${repo}/contributors`;
  fetch(requestURL, { mode: "cors" })
    .then((res) => {
      if (res.ok) {
        const autoFill = form.elements["auto-fill"].checked;
        window.location.href = `/makereadme?owner=${owner}&repo=${repo}&autofill=${autoFill}`;
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .catch((err) => {
      console.error(err);
      showWarning();
    });
};

// ☆☆☆☆☆ Catalog ☆☆☆☆☆
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
        const path = `${json[i].user}/${json[i].repository}`;
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

// ☆☆☆☆☆ Footer ☆☆☆☆☆
const getCount = () => {
  fetch("/getcount")
    .then((res) => res.json())
    .then((data) => {
      if (data.result === "success") {
        counter.textContent = ` +${data.count.toLocaleString()}`;
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const loadCatalog = () => {
  Promise.all([getStylesheet(), getGeneratedReadmes()])
    .then(([stylesheet, list]) => {
      let cnt = 0;
      list.forEach(({ path, text }) => {
        if (
          text.indexOf("<!-- CREATED_BY_LEADYOU_README_GENERATOR -->") < 0 ||
          12 <= cnt
        )
          return;

        const div = document.createElement("div");
        div.setAttribute("class", "readme");

        const wrapDiv = document.createElement("div");
        wrapDiv.setAttribute("class", "wrap-iframe");

        const iframe = document.createElement("iframe");
        iframe.setAttribute("title", path);
        const newText = convertRelativeToAbsolute(path, text);
        let html = `<html><head><style>${stylesheet}</style></head><body>`;
        html += `<div class="md-content">${marked(
          newText
        )}</div></body></html>`;
        iframe.srcdoc = html;

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
        cnt += 1;
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

// called on load
(() => {
  getCount();

  loadCatalog();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    validationURL();
  });

  urlColumn.addEventListener("input", (e) => {
    if (urlColumn.value.length === 0) {
      autoFillCheck.setAttribute("disabled", "");
    } else if (urlColumn.value.length > 0) {
      autoFillCheck.removeAttribute("disabled");
    }
  });
})();
