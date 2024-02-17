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
const searchCodes = async () => {
  const leadyouTag = "CREATED_BY_LEADYOU_README_GENERATOR";
  let requestURL = "https://api.github.com/search/code";
  requestURL += `?q=${leadyouTag}+in:file+language:md+filename:README+path:/`;

  const json = await getJSON(requestURL);
  return json.items.map((item) => ({
    ownerRepo: item.repository.full_name,
    sha: item.html_url.split("/blob/").pop().split("/").shift(),
  }));
};

const getDate = async (ownerRepo, sha) => {
  const requestURL = `https://api.github.com/repos/${ownerRepo}/commits/${sha}`;

  const props = { ownerRepo, sha };
  try {
    const json = await getJSON(requestURL);
    return { ...props, date: Date.parse(json.commit.committer.date) };
  } catch (error) {
    console.log(ownerRepo, sha);
    console.error(error);
    return { ...props, date: null };
  }
};

const fetchReadmes = async () => {
  const codes = await searchCodes();
  const promises = codes.map(({ ownerRepo, sha }) => {
    return getDate(ownerRepo, sha);
  });
  let commits = await Promise.all(promises);
  const repositories = commits
    .filter((commit) => commit.date !== null)
    .sort((a, b) => b.date - a.date)
    .map((props) => {
      const rawURL = `https://raw.githubusercontent.com/${props.ownerRepo}/${props.sha}`;
      return { ...props, rawURL };
    })
    .slice(0, 12);
  return { totalCount: codes.length, repositories };
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
