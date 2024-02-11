import React from "react";
import { EditorState } from "./Editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type Props = {
  editorState: EditorState;
};

export default function Preview(props: Props) {
  const { editorState } = props;

  return <ReactMarkdown children={""} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} />;
}
