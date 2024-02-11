import React, { useState, useRef, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import "./AttachmentWithMultiLineField.css";

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
};

export default function UploadFile(props: Props) {
  const { t } = useTranslation();
  const { description, maxLength, values, setValues } = props;
  const [files, setFiles] = useState([""]);
  const inputElement = useRef<HTMLInputElement>(null);

  let desc: string = description;
  if (maxLength !== undefined && maxLength > 0) {
    desc = `${description} (in ${maxLength} characters or less)`;
  }

  const chunked = (array: string[], chunk: number): string[][] => {
    return array.reduce<string[][]>((result, value, index) => {
      if (index % chunk === 0) {
        result.push([value]);
      } else {
        result[result.length - 1].push(value);
      }
      return result;
    }, []);
  };

  const handleSelectFile = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList !== null) {
      const blobURL = window.URL.createObjectURL(fileList[0]);
      setValues(
        values.map((v, j) => {
          return j === 2 * index ? blobURL : v;
        })
      );
    }
  };

  const handleClear = (index: number) => {
    setValues(
      values.map((v, j) => {
        return j === 2 * index ? "" : v;
      })
    );
    if (inputElement.current !== null) {
      inputElement.current.value = "";
    }
  };

  const handleTextareaChange = (index: number, event: ChangeEvent<HTMLTextAreaElement>) => {
    setValues(
      values.map((v, j) => {
        return j === 2 * index + 1 ? event.target.value : v;
      })
    );
  };

  const handleDelete = (index: number) => {
    setValues(
      values.filter((_, j) => {
        return ![2 * index, 2 * index + 1].includes(j);
      })
    );
    setFiles(files.filter((_, j) => index === j));
  };

  const rows = chunked(values, 2).map((value, i) => {
    return (
      <div key={`attachment-sub-section-${i}`} className="container">
        <div className="inner">
          <input
            type="file"
            value={files[i]}
            onChange={(e) => handleSelectFile(i, e)}
            accept={props.kindsOfFile?.join(", ") || ""}
            ref={inputElement}
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
    <div className="attachment-with-multi-line-field">
      <h3 className="sub-title">
        {props.title}
        {props.required && <span className="mark-required">*</span>}
      </h3>
      <p>{desc}</p>
      {rows}
      {props.multiple && (
        <input
          type="button"
          value="add"
          onClick={(_) => {
            setValues([...values, "", ""]);
            setFiles([...files, ""]);
          }}
          className="add"
        />
      )}
    </div>
  );
}
