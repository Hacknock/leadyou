const form = document.getElementById("generate-form");
const urlColumn = document.getElementById("url-column");
const alertText = document.getElementById("alert-text");
const autoFillCheck = document.getElementById("auto-fill");
const catalogArea = document.getElementById("catalog-area");
const counter = document.getElementById("counter");
const acceptCookieFonts = document.getElementById("accept-cookies-fonts");
const acceptFonts = document.getElementById("accept-fonts");
const acceptCookie = document.getElementById("accept-cookies");
const footer = document.getElementById("footer");
const attentionCookie = document.getElementById("attention-cookie");

// Cookie control
let positionHeight = document.body.clientHeight - window.innerHeight - document.documentElement.scrollTop;
if (positionHeight < footer.offsetHeight) {
  attentionCookie.style.bottom = (footer.offsetHeight - positionHeight) + "px";
}
window.addEventListener("scroll", (e) => {
  let positionHeight = document.body.clientHeight - window.innerHeight - document.documentElement.scrollTop;
  if (positionHeight < footer.offsetHeight) {
    attentionCookie.style.bottom = (footer.offsetHeight - positionHeight) + "px";
    console.log(attentionCookie.style.bottom)
  } else {
    attentionCookie.style.bottom = "0px";
  }
});

acceptCookieFonts.addEventListener("click", () => {
  enableGA();
  enableFont();
  attentionCookie.style.display = "none";
});

acceptCookie.addEventListener("click", () => {
  enableGA();
  attentionCookie.style.display = "none";
});

acceptFonts.addEventListener("click", () => {
  enableFont();
  attentionCookie.style.display = "none";
});

const enableFont = () => {
  const link = document.createElement("link");
  link.setAttribute("href", "https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap");
  link.setAttribute("rel", "stylesheet");
  document.getElementsByTagName("head")[0].appendChild(link);
  document.cookie = "font = true";
}

document.cookie.split(";").some(item => {
  if(item.trim().indexOf("font=") === 0) {
    attentionCookie.style.display = "none";
    if (item.trim().split("=")[1] === "true") enableFont();
  } else if (item.trim().indexOf("cookie=") === 0){
    attentionCookie.style.display = "none";
    if (item.trim().split("=")[1] === "true") enableGA();
  } else {
    //nothing
  }
});


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
