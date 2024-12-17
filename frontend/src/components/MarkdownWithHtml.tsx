import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // HTML 태그를 처리하는 플러그인

const MarkdownWithHtml = ({ markdownContent }: { markdownContent: string }) => {
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdownContent}</ReactMarkdown>
  );
};

export default MarkdownWithHtml;
