(() => {
  if (process.argv.length !== 3) {
    const error = new Error("Argument was incorrectly specified.");
    console.error("⚠️", error);
    process.exit(0);
  }
})();

import fetch from "node-fetch";
import { promises as fs } from "fs";
const apiToken = process.argv[2];

// Tap GitHub API
const checkStatus = (response) => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(`HTTP Error Response: ${response.status} ${response.statusText}`);
  }
};

const getJSON = (requestURL) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: `token ${apiToken}`,
      Accept: "application/vnd.github+json",
    },
  };
  return fetch(requestURL, options).then((res) => checkStatus(res));
};

// Fetch READMEs
const fetchReadmes = async () => {
  const leadyouTag = "CREATED_BY_LEADYOU_README_GENERATOR";
  let requestURL = "https://api.github.com/search/code";
  requestURL += `?q=${leadyouTag}+in:file+language:md+filename:README+path:/`;
  requestURL += "&sort=updated";

  try {
    const json = await getJSON(requestURL);
    console.log("total_count", json.total_count);
    const repositories = json.items
      .map((item) => {
        let rawURL = "https://raw.githubusercontent.com/";
        rawURL += item.repository.full_name;
        rawURL += item.html_url.split("blob").pop();
        const sha = item.html_url.split("/blob/").pop().split("/").shift();
        return {
          ownerRepo: item.repository.full_name,
          rawURL: rawURL,
          sha: sha,
        };
      })
      .slice(0, 12);
    return { totalCount: json.total_count, repositories: repositories };
  } catch (error) {
    throw error;
  }
};

// Overwrite Catalog.json
const overwriteCatalog = async (catalog) => {
  const text = JSON.stringify(catalog, null, 2);
  try {
    await fs.writeFile("src/json/catalog.json", text);
  } catch (error) {
    throw error;
  }
};

(async () => {
  try {
    const catalog = await fetchReadmes();
    console.dir(catalog, { depth: null });
    console.log("count", catalog.repositories.length);
    await overwriteCatalog(catalog);
  } catch (error) {
    console.error("⚠️", error);
    process.exit(1);
  }
})();
