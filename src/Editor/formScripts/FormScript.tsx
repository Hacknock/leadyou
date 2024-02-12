export type FormScriptResult = {
  values: string[];
};

export interface FormScript {
  getValues(repoURL: string): Promise<FormScriptResult>;
}
