import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const MarkdownWithHtml = ({ markdownContent }: { markdownContent: string }) => {
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdownContent}</ReactMarkdown>
  );
};

export default MarkdownWithHtml;
