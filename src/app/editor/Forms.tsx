import React from "react";
import { EditorState } from "./Editor";
import OneLineField from "./form-types/OneLineField";
import MultiLineField from "./form-types/MultiLineField";
import FileWithMultiLineField from "./form-types/FileWithMultiLineField";

type Props = {
  editorState: EditorState;
  setValues: (at: number, values: string[]) => void;
  setFiles: (at: number, values: string[], files: (File | null)[]) => void;
};

export default function Forms(props: Props) {
  const { editorState, setValues, setFiles } = props;

  const forms = editorState.sectionStates
    .map(({ section, values, files }, index) => {
      switch (section.formType) {
        case "one-line-field":
          return (
            <OneLineField
              key={`one-line-field-${index}`}
              title={section.title}
              description={section.description}
              required={section.required}
              multiple={section.multiple}
              placeholder={section.attributes.placeholder}
              maxLength={section.attributes.maxLength}
              values={values}
              setValues={(values) => setValues(index, values)}
              showAlert={editorState.showAlert}
            />
          );
        case "multi-line-field":
          return (
            <MultiLineField
              key={`multi-line-field-${index}`}
              title={section.title}
              description={section.description}
              required={section.required}
              multiple={section.multiple}
              placeholder={section.attributes.placeholder}
              maxLength={section.attributes.maxLength}
              values={values}
              setValues={(values) => setValues(index, values)}
              showAlert={editorState.showAlert}
            />
          );
        case "file-with-multi-line-field":
          return (
            <FileWithMultiLineField
              key={`file-with-multi-line-field-${index}`}
              title={section.title}
              description={section.description}
              required={section.required}
              multiple={section.multiple}
              kindsOfFile={section.attributes.kindsOfFile || null}
              placeholder={section.attributes.placeholder}
              maxLength={section.attributes.maxLength}
              values={values}
              setValues={(values) => setValues(index, values)}
              files={files}
              setFiles={(values, files) => setFiles(index, values, files)}
              showAlert={editorState.showAlert}
            />
          );
      }
    })
    .flatMap((item, i) => {
      return i === 0 ? item : [<hr key={`separater-${i}`} className="separater" />, item];
    });

  return <React.Fragment>{forms}</React.Fragment>;
}
