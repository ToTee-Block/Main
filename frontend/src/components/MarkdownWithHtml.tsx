import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";

const MarkdownWithHtml = ({ markdownContent }: { markdownContent: string }) => {
  return (
    <ReactMarkdown
      rehypePlugins={[
        rehypeRaw,
        [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }],
      ]}
    >
      {markdownContent}
    </ReactMarkdown>
  );
};

export default MarkdownWithHtml;
