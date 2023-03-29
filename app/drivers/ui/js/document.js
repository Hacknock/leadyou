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

const getQueryStringParams = (query) => {
  const hoge = /^[?#]/.test(query) ? query.slice(1) : query;
  return hoge.split("&").reduce((params, param) => {
    const [key, value] = param.split("=");
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

const loadMarkdown = async () => {
  const outputEle = document.getElementById("document-area");
  const params = getQueryStringParams(window.location.search);
  if (!("md" in params)) {
    const err = new Error("The page is not specified.");
    console.error(err);
    outputEle.innerHTML = `<p>${err}</p>`;
    return;
  }
  try {
    const md = await getMarkdown(`/src/md/${params.md}.md`);
    outputEle.innerHTML = marked.parse(md);
  } catch (err) {
    console.error(err);
    outputEle.innerHTML = `<p>${err}</p>`;
  }
};

loadMarkdown();
