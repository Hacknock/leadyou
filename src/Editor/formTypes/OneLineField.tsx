import React from "react";
import "./OneLineField.css";

type Props = {
  title: string;
  description: string;
  required: boolean;
  multiple: boolean;
  placeholder?: string;
  maxLength?: number;
  values: string[];
  setValues: (values: string[]) => void;
  showAlert: boolean;
};

export default function OneLineField(props: Props) {
  const { description, maxLength, values, setValues } = props;

  let desc: string = description;
  if (maxLength !== undefined && maxLength > 0) {
    desc = `${description} (in ${maxLength} characters or less)`;
  }

  const showWarning = (() => {
    const isEmpty =
      values.reduce((result, value) => {
        return result + value.length;
      }, 0) === 0;
    return props.required && props.showAlert && isEmpty;
  })();

  const rows = values.map((value, i) => {
    return (
      <div key={`one-line-${i}`} className="container">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValues(values.map((v, j) => (j === i ? e.target.value : v)));
          }}
          placeholder={props.placeholder}
          maxLength={maxLength}
          className={showWarning ? "warning" : undefined}
        />
        {values.length > 1 && (
          <input
            type="button"
            value="delete"
            onClick={(e) => {
              setValues(values.filter((_, j) => j !== i));
              console.log("delete");
            }}
            className="delete"
          />
        )}
      </div>
    );
  });

  return (
    <div className="one-line-field">
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
          onClick={(e) => {
            setValues([...values, ""]);
          }}
          className="add"
        />
      )}
    </div>
  );
}
