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

module.exports.getValues = (repoUrl, token) => {
  const errorPromise = (message) => {
    return new Promise((_, reject) => reject(new Error(message)));
  };

  if (!repoUrl.startsWith("https://github.com/")) {
    return errorPromise("Inputed repository url is not correct.");
  }
  const splitRepoUrl = repoUrl.split("/");
  if (splitRepoUrl.length < 5) {
    return errorPromise("Can not specify the repository with the inputed url.");
  }

  const sieldsUrl = "https://img.shields.io/github";
  const badgeInfoList = [
    { name: "issues", path: "issues", jumpKey: "issues" },
    { name: "forks", path: "forks", jumpKey: "network/members" },
    { name: "stars", path: "stars", jumpKey: "stargazers" },
    { name: "top language", path: "languages/top", jumpKey: "" },
    { name: "license", path: "license", jumpKey: "" },
  ];
  let returnJson = {
    title: "Badges",
  };

  let arrayValue = new Array();
  for (const info of badgeInfoList) {
    arrayValue = arrayValue.concat(
      `[![Github ${info.name}](${sieldsUrl}/${info.path}/${splitRepoUrl[3]}/${splitRepoUrl[4]})](${repoUrl}/${info.jumpKey})`
    );
  }
  returnJson.values = arrayValue;
  return new Promise((resolve, _) => resolve(returnJson));
};
