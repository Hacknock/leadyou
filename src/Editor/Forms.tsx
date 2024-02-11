import React from "react";
import { EditorState } from "./Editor";
import OneLineField from "./formTypes/OneLineField";
import MultiLineField from "./formTypes/MultiLineField";
import AttachmentWithMultiLineField from "./formTypes/AttachmentWithMultiLineField";

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
            />
          );
        case "attachment-with-multi-line-field":
          return (
            <AttachmentWithMultiLineField
              key={`attachment-with-multi-line-field-${index}`}
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
            />
          );
      }
    })
    .flatMap((item, i) => [item, <hr key={`separater-${i}`} className="separater" />]);

  return <React.Fragment>{forms}</React.Fragment>;
}
