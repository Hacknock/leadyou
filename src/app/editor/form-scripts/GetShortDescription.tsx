import { FormScript, FormScriptResult } from "./FormScript";

export default class GetShortDescription implements FormScript {
  async getValues(repoURL: string): Promise<FormScriptResult> {
    if (!repoURL.startsWith("https://github.com/")) {
      throw new Error("Inputed repository url is not correct.");
    }
    const splitRepoURL = repoURL.split("/");
    if (splitRepoURL.length < 5) {
      throw new Error("Can not specify the repository with the inputed url.");
    }

    const requestURL = `https://api.github.com/repos/${splitRepoURL[3]}/${splitRepoURL[4]}`;
    const options: RequestInit = {
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    try {
      const response = await fetch(requestURL, options);
      const json = await response.json();
      const description = "description" in json ? json.description : "";
      return { script: this.constructor.name, values: [description] };
    } catch (err) {
      throw err;
    }
  }
}