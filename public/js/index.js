const form = document.getElementById("generate-form");
const urlColumn = document.getElementById("url-column");

// ☆☆☆☆☆ Top Form ☆☆☆☆☆
const showWarning = () => {
  urlColumn.setAttribute("class", "url alert-repo");
  document.getElementById("alert-text").textContent =
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
  return fetch("/src/css/marked.css").then((res) => res.text());
};

const getGeneratedReadme = async (owner, repo) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  };
  const request = `https://api.github.com/repos/${owner}/${repo}/readme`;
  return fetch(request, options)
    .then((res) => {
      return res.json().then((json) => {
        if (res.ok) {
          return {
            path: `${owner}/${repo}`,
            branch: json.url.split("?ref=")[1],
            text: decodeURIComponent(escape(atob(json.content))),
          };
        } else {
          throw new Error("readme not found");
        }
      });
    })
    .catch((err) => {
      console.error(err);
      return {
        path: "",
        branch: "",
        text: "",
      };
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
      const promises = json.map((item) => {
        return getGeneratedReadme(item.user, item.repository);
      });
      return Promise.all(promises);
    });
};

const convertRelativeToAbsolute = (path, branch, md) => {
  let text = md;
  const regex = /http(s)?:\/\/.+/;
  const array = text.match(/\[([^\[\]\(\)]*?)\]\(([^\[\]\(\)]*?)\)/g);
  for (const tag of array) {
    const item = tag.match(/^\[.*?\]\((.*?)\)$/)[1];
    if (regex.test(item)) {
      // httpsにマッチした場合
      const newTag = tag.replace(
        `://github.com/${path}/blob/`,
        `://github.com/${path}/raw/`
      );
      text = text.replace(tag, newTag);
    } else {
      // 相対パスだった場合
      const after = item.match(/^(\.\/)*(.+)/)[2];
      const newTag = tag.replace(
        item,
        `https://github.com/${path}/raw/${branch}/${after}`
      );
      text = text.replace(tag, newTag);
    }
  }
  return text;
};

// ☆☆☆☆☆ Cookie Manager ☆☆☆☆☆
const hideAgreementCookie = () => {
  document.getElementById("attention-cookie").style.display = "none";
  document.getElementsByClassName("dummy-footer")[0].style.display = "none";
};

const setupCookieManager = () => {
  document
    .getElementById("accept-cookies-fonts")
    .addEventListener("click", () => {
      enableGA();
      enableFont();
      hideAgreementCookie();
    });
  document.getElementById("accept-fonts").addEventListener("click", () => {
    enableFont();
    hideAgreementCookie();
  });
  document.getElementById("accept-cookies").addEventListener("click", () => {
    enableGA();
    hideAgreementCookie();
  });
  document.getElementById("cancel-cookie").addEventListener("click", () => {
    hideAgreementCookie();
  });

  document.cookie
    .split(";")
    .map((item) => item.trim())
    .forEach((item) => {
      if (item.startsWith("font=")) {
        if (item.split("=")[1] === "true") enableFont();
        hideAgreementCookie();
      } else if (item.startsWith("cookie=")) {
        if (item.split("=")[1] === "true") enableGA();
        hideAgreementCookie();
      }
    });
};

// ☆☆☆☆☆ Footer ☆☆☆☆☆
const getCount = () => {
  const counter = document.getElementById("counter");
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
  const catalogArea = document.getElementById("catalog-area");
  Promise.all([getStylesheet(), getGeneratedReadmes()])
    .then(([stylesheet, list]) => {
      let cnt = 0;
      const identifier = "<!-- CREATED_BY_LEADYOU_README_GENERATOR -->";
      list.forEach(({ path, branch, text }) => {
        if (path === "") return;
        if (text.indexOf(identifier) < 0 || 9 <= cnt) return;
        const div = document.createElement("div");
        div.setAttribute("class", "readme");
        const wrapDiv = document.createElement("div");
        wrapDiv.setAttribute("class", "wrap-iframe");
        const iframe = document.createElement("iframe");
        iframe.setAttribute("title", path);
        const newText = convertRelativeToAbsolute(path, branch, text);
        let style = ".md-content { padding: 16px; text-align: left; }";
        style += stylesheet;
        let html = `<html><head><style>${style}</style></head><body>`;
        html += `<div class="md-content">${marked.parse(
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
  setupCookieManager();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    validationURL();
  });

  urlColumn.addEventListener("input", (e) => {
    const autoFillCheck = document.getElementById("auto-fill");
    if (urlColumn.value.length === 0) {
      autoFillCheck.setAttribute("disabled", "");
    } else if (urlColumn.value.length > 0) {
      autoFillCheck.removeAttribute("disabled");
    }
  });
})();
