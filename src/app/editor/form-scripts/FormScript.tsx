export type FormScriptResult = {
  title: string;
  values: string[];
};

export interface FormScript {
  getValues(repoURL: string): Promise<FormScriptResult>;
}
