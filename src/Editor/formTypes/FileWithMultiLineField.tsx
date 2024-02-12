import React, { useRef, useEffect, ChangeEvent } from "react";
import { chunked } from "../../Utils";
import "./FileWithMultiLineField.css";

type FileInputProps = {
  file: File | null;
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  accept: string;
};

function FileInput(props: FileInputProps) {
  const { file, handleOnChange, accept } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      if (file) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputRef.current.files = dataTransfer.files;
      } else {
        inputRef.current.value = "";
      }
    }
  }, [file]);

  return <input type="file" ref={inputRef} onChange={(e) => handleOnChange(e)} accept={accept} />;
}

type Props = {
  title: string;
  description: string;
  required: boolean;
  multiple: boolean;
  kindsOfFile: string[] | null;
  placeholder?: string;
  maxLength?: number;
  values: string[];
  setValues: (values: string[]) => void;
  files: (File | null)[];
  setFiles: (values: string[], files: (File | null)[]) => void;
};

export default function FileWithMultiLineField(props: Props) {
  const { description, maxLength, values, setValues, files, setFiles } = props;

  let desc: string = description;
  if (maxLength !== undefined && maxLength > 0) {
    desc = `${description} (in ${maxLength} characters or less)`;
  }

  const handleSelectFile = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList !== null) {
      const blobURL = window.URL.createObjectURL(fileList[0]);
      setFiles(
        values.map((v, j) => (j === 2 * index ? blobURL : v)),
        files.map((v, j) => (j === index ? fileList[0] : v))
      );
    }
  };

  const handleClear = (index: number) => {
    setFiles(
      values.map((v, j) => (j === 2 * index ? "" : v)),
      files.map((v, j) => (j === index ? null : v))
    );
  };

  const handleTextareaChange = (index: number, event: ChangeEvent<HTMLTextAreaElement>) => {
    setValues(values.map((v, j) => (j === 2 * index + 1 ? event.target.value : v)));
  };

  const handleDelete = (index: number) => {
    setFiles(
      values.filter((_, j) => {
        return ![2 * index, 2 * index + 1].includes(j);
      }),
      files.filter((_, j) => j !== index)
    );
  };

  const handleAdd = () => {
    setFiles([...values, "", ""], [...files, null]);
  };

  const rows = chunked(values, 2).map((value, i) => {
    return (
      <div key={`file-sub-section-${i}`} className="container">
        <div className="inner">
          <FileInput
            file={files[i]}
            handleOnChange={(e) => handleSelectFile(i, e)}
            accept={props.kindsOfFile?.join(", ") || ""}
          />
          <button type="button" className="clear" onClick={() => handleClear(i)}>
            <img src="images/close.png" className="close" />
          </button>
          <textarea
            value={value[1]}
            onChange={(e) => handleTextareaChange(i, e)}
            placeholder={props.placeholder}
            maxLength={maxLength}
          />
        </div>
        {values.length > 2 && (
          <input type="button" value="delete" onClick={() => handleDelete(i)} className="delete" />
        )}
      </div>
    );
  });

  return (
    <div className="file-with-multi-line-field">
      <h3 className="sub-title">
        {props.title}
        {props.required && <span className="mark-required">*</span>}
      </h3>
      <p>{desc}</p>
      {rows}
      {props.multiple && (
        <input type="button" value="add" onClick={(_) => handleAdd()} className="add" />
      )}
    </div>
  );
}
