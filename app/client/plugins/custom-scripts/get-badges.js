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

module.exports.getValues = async (repoURL, _) => {
  if (!repoURL.startsWith("https://github.com/")) {
    throw new Error("Inputed repository url is not correct.");
  }
  const splitRepoURL = repoURL.split("/");
  if (splitRepoURL.length < 5) {
    throw new Error("Can not specify the repository with the inputed url.");
  }

  const sieldsURL = "https://img.shields.io/github";
  const badgeInfoList = [
    { name: "issues", path: "issues", jumpKey: "issues" },
    { name: "forks", path: "forks", jumpKey: "network/members" },
    { name: "stars", path: "stars", jumpKey: "stargazers" },
    { name: "top language", path: "languages/top", jumpKey: "" },
    { name: "license", path: "license", jumpKey: "" },
  ];

  const values = badgeInfoList.map((info) => {
    const url = `${sieldsURL}/${info.path}/${splitRepoURL[3]}/${splitRepoURL[4]})](${repoURL}/${info.jumpKey}`;
    return `[![Github ${info.name}](${url})`;
  });

  return { title: "Badges", values: values };
};
