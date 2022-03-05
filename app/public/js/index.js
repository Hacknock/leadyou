/**
 * Copyright 2022 Hacknock
 *
 * Licensed under the Apache License, Version 2.0(the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const form = document.getElementById("generate-form");
const urlColumn = document.getElementById("url-column");

// ★★★ Top Form ★★★
const showWarning = () => {
  urlColumn.setAttribute("class", "url alert-repo");
  document.getElementById("alert-text").textContent =
    "This repository is a private repository or does not exist.";
};

const validationURL = async () => {
  const url = form.elements["url"].value;
  if (url.length === 0) {
    window.location.href = "/makereadme";
    return;
  }
  const splitURL = url.split("/");
  if (!url.startsWith("https://github.com/") || splitURL.length < 5) {
    showWarning();
    return;
  }
  const owner = splitURL[3];
  const repo = splitURL[4];

  try {
    const requestURL = `https://api.github.com/repos/${owner}/${repo}/contributors`;
    const response = await fetch(requestURL, { mode: "cors" });
    if (response.ok) {
      const autoFill = form.elements["auto-fill"].checked;
      window.location.href = `/makereadme?owner=${owner}&repo=${repo}&autofill=${autoFill}`;
    } else {
      throw new Error("network response was not ok.");
    }
  } catch (err) {
    console.log(err);
    showWarning();
  }
};

// ★★★ README Catalog ★★★
const getStylesheet = async () => {
  try {
    const response = await fetch("/src/css/marked.css");
    return await response.text();
  } catch (err) {
    throw err;
  }
};

const getReadme = async (owner, repo, branch) => {
  try {
    const requestURL = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
    const response = await fetch(requestURL);
    const text = await response.text();
    return { path: `${owner}/${repo}`, branch: branch, text: text };
  } catch (err) {
    console.error(err);
    return { path: "", branch: "", text: "" };
  }
};

const getGeneratedReadmes = async () => {
  try {
    const response = await fetch("/getlist");
    const json = await response.json();
    if (json.result !== "success") {
      throw new Error("failed to get list");
    }
    const promises = json.records.map((record) => {
      return getReadme(record.owner, record.repository, record.branch);
    });
    return Promise.all(promises);
  } catch (err) {
    throw err;
  }
};

const convertURLtoGitHubURL = (path, branch, tag, item, md) => {
  let text = md;
  const regex = /http(s)?:\/\/.+/;
  if (regex.test(item)) {
    // httpsにマッチした場合
    const newTag = tag.replace(
      `://github.com/${path}/blob/`,
      `://github.com/${path}/raw/`
    );
    text = text.replace(tag, newTag);
  } else {
    // 相対パスだった場合（万能ではない）
    const after = item.match(/^(\.\/)*(.+)/)[2];
    const newTag = tag.replace(
      item,
      `https://github.com/${path}/raw/${branch}/${after}`
    );
    text = text.replace(tag, newTag);
  }
  return text;
};

const convertMarkdownImageLink = (path, branch, md) => {
  let text = md;
  const tags = text.match(/!\[([^\[\]\(\)]*?)\]\(([^\[\]\(\)]*?)\)/g);
  if (Array.isArray(tags)) {
    for (const tag of tags) {
      const item = tag.match(/^!\[.*?\]\((.*?)\)$/)[1];
      text = convertURLtoGitHubURL(path, branch, tag, item, text);
    }
  }
  return text;
};

const convertHTMLImageLink = (path, branch, md) => {
  let text = md;
  const tags = text.match(/(<img src="(.*?)"|<img .*? src="(.*?)")/g);
  if (Array.isArray(tags)) {
    for (const tag of tags) {
      const matched = tag.match(/^(<img src="(.*?)"|<img .*? src="(.*?)")$/);
      if (typeof matched[2] !== "undefined") {
        text = convertURLtoGitHubURL(path, branch, tag, matched[2], text);
      } else if (typeof matched[3] !== "undefined") {
        text = convertURLtoGitHubURL(path, branch, tag, matched[3], text);
      }
    }
  }
  return text;
};

const convertRelativeToAbsolute = (path, branch, md) => {
  // Markdownの画像添付記法 ![]()
  let text = convertMarkdownImageLink(path, branch, md);
  // HTMLのimgタグ <img src=""
  text = convertHTMLImageLink(path, branch, text);
  return text;
};

const loadCatalog = async () => {
  try {
    const [stylesheet, list] = await Promise.all([
      getStylesheet(),
      getGeneratedReadmes(),
    ]);
    let cnt = 0;
    const catalogArea = document.getElementById("catalog-area");
    list.forEach(({ path, branch, text }) => {
      if (path === "" || 9 <= cnt) return;
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
  } catch (err) {
    console.error(err);
  }
};

// ★★★ Cookie Manager ★★★
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
      if (item.startsWith("font=") && item.split("=")[1] === "true") {
        enableFont();
        hideAgreementCookie();
      } else if (item.startsWith("cookie=") && item.split("=")[1] === "true") {
        enableGA();
        hideAgreementCookie();
      }
    });
};

// ★★★ Footer ★★★
const getCount = async () => {
  try {
    const response = await fetch("/getcount");
    const json = await response.json();
    if (json.result !== "success") {
      throw new Error("failed to get count");
    }
    const counter = document.getElementById("counter");
    counter.textContent = ` +${json.count.toLocaleString()}`;
  } catch (err) {
    console.error(err);
  }
};

// ★★★ called on load ★★★
(() => {
  getCount();
  loadCatalog();
  setupCookieManager();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    validationURL();
  });

  urlColumn.addEventListener("input", () => {
    const autoFillCheck = document.getElementById("auto-fill");
    if (urlColumn.value.length === 0) {
      autoFillCheck.setAttribute("disabled", "");
    } else if (urlColumn.value.length > 0) {
      autoFillCheck.removeAttribute("disabled");
    }
  });
})();
