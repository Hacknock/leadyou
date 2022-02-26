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

module.exports.getValues = (repoUrl, token) => {
  const errorPromise = (message) => {
    return new Promise((_, reject) => reject(new Error(message)));
  };

  if (!repoUrl.startsWith("https://github.com/"))
    return errorPromise("Inputed repository url is not correct.");
  const splitRepoUrl = repoUrl.split("/");
  if (splitRepoUrl.length < 5)
    return errorPromise("Can not specify the repository with the inputed url.");

  const requestURL = `https://api.github.com/repos/${splitRepoUrl[3]}/${splitRepoUrl[4]}/contributors`;

  const options = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  if (typeof token === "undifined")
    options.headers["Authorization"] = `token ${token}`;

  return fetch(requestURL, options)
    .then((res) => res.json())
    .then((res) => {
      let returnJson = {
        title: "Contributors",
      };
      let arrayValue = new Array();
      for (const user of res) {
        arrayValue = arrayValue.concat(`[${user.login}](${user.html_url})`);
      }
      returnJson.values = arrayValue;
      return returnJson;
    })
    .catch((err) => {
      throw err;
    });
};
