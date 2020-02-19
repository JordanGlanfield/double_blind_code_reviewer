import React from "react";

import highlight from "highlight.js";

interface Props {
  children?: any
}

const SyntaxHighlighter = (props: Props) => {
  return (
    <pre>
      <code>
        {highlight.highlightAuto(props.children).value}
      </code>
    </pre>
  );
};

export default SyntaxHighlighter;