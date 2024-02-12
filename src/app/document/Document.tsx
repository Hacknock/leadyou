import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./Document.css";

type Props = {
  pageID: string | null;
};

export default function Document(props: Props) {
  const { pageID } = props;
  const [file, setFile] = useState("");

  useEffect(() => {
    fetch(`./md/${pageID || "error"}.md`)
      .then((response) => response.text())
      .then((text) => setFile(text));
  }, []);

  return (
    <div className="document md-content">
      <ReactMarkdown children={file} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} />
    </div>
  );
}
