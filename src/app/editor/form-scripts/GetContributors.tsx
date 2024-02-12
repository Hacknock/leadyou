import { FormScript, FormScriptResult } from "./FormScript";

export default class GetContributors implements FormScript {
  async getValues(repoURL: string): Promise<FormScriptResult> {
    if (!repoURL.startsWith("https://github.com/")) {
      throw new Error("Inputed repository url is not correct.");
    }
    const splitRepoURL = repoURL.split("/");
    if (splitRepoURL.length < 5) {
      throw new Error("Can not specify the repository with the inputed url.");
    }

    const requestURL = `https://api.github.com/repos/${splitRepoURL[3]}/${splitRepoURL[4]}/contributors`;
    const options: RequestInit = {
      mode: "cors",
      headers: { Accept: "application/vnd.github+json" },
    };

    const result: FormScriptResult = {
      script: "GetContributors",
      values: [],
    };

    try {
      const response = await fetch(requestURL, options);
      const json = await response.json();
      if (!Array.isArray(json)) {
        return result;
      }
      const values = json.map((user) => {
        return `[${user.login}](${user.html_url})`;
      });
      return { ...result, values: values };
    } catch (err) {
      throw err;
    }
  }
}
