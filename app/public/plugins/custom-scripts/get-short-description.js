/**
 * Copyright 2020 Hacknock
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fetch = require("node-fetch");

module.exports.getValues = async (repoURL, token) => {
  if (!repoURL.startsWith("https://github.com/")) {
    throw new Error("Inputed repository url is not correct.");
  }
  const splitRepoURL = repoURL.split("/");
  if (splitRepoURL.length < 5) {
    throw new Error("Can not specify the repository with the inputed url.");
  }

  const requestURL = `https://api.github.com/repos/${splitRepoURL[3]}/${splitRepoURL[4]}`;
  const options = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };
  if (typeof token !== "undefined") {
    options.headers["Authorization"] = `token ${token}`;
  }

  try {
    const response = await fetch(requestURL, options);
    const json = await response.json();
    const description = "description" in json ? json.description : "";
    return { title: "Short Description", values: [description] };
  } catch (err) {
    throw err;
  }
};
