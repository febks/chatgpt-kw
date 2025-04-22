import React from "react";

export const markdownComponents = {
  a: ({ ...props }) => (
    <a {...props} className="text-blue-500 hover:underline" />
  ),
  li: ({ type = "bullet", ...props }) => (
    <li {...props} className={`ml-8 ${type === "bullet" ? "list-disc" : "list-decimal"}`} />
  ),
  hr: ({ ...props }) => (
    <hr {...props} className="my-2 border-t border-neutral-400" />
  ),
  h4: ({ ...props }) => (
    <h4 {...props} className="text-base my-1" />
  ),
  h3: ({ ...props }) => (
    <h3 {...props} className="text-lg my-1" />
  ),
  h2: ({ ...props }) => (
    <h2 {...props} className="text-xl my-1" />
  ),
  h1: ({ ...props }) => (
    <h1 {...props} className="text-2xl my-2" />
  ),
}

export function parseMarkdown(markdown: string): React.ReactNode[] {
  const lines = markdown.split("\n");

  const elements: React.ReactNode[] = [];

  let listItems: React.ReactNode[] = [];
  let indentLevel = 0;

  let isCodeBlock = false;
  let codeBlockLines: string[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const spaceCount = line.length - trimmed.length;
    const currentIndentLevel = Math.floor(spaceCount / 3);

    // Handle indentation change
    if (currentIndentLevel > indentLevel) {
      indentLevel = currentIndentLevel;
    } else if (currentIndentLevel < indentLevel) {
      indentLevel = currentIndentLevel;
    }

    // Start or end code block
    if (trimmed.startsWith("```") && !isCodeBlock) {
      isCodeBlock = true; // Start of code block
      codeBlockLines = [];
    } else if (trimmed.startsWith("```") && isCodeBlock) {
      isCodeBlock = false; // End of code block
      elements.push(
        <pre key={`code-${index}`} className="bg-gray-100 text-gray-800 p-4 rounded">
          <code>{codeBlockLines.join("\n")}</code>
        </pre>
      );
      codeBlockLines = []; // Reset code block lines
    } else if (isCodeBlock) {
      codeBlockLines.push(trimmed); // Collect code block lines
    } else {
      // Handle list
      if (trimmed.startsWith("- ")) {
        listItems.push(
          <li key={index} className="ml-8 list-disc">
            {renderInline(trimmed.slice(2))}
          </li>
        );
      } else {
        // If there are previous list items, wrap them in <ul>
        if (listItems.length > 0) {
          elements.push(
            <ul key={`ul-${index}`} className="mb-2">
              {listItems}
            </ul>
          );
          listItems = [];
        }

        if (trimmed.startsWith("#### ")) {
          elements.push(
            <h4 key={index} className="text-base font-semibold my-1">
              {renderInline(trimmed.replace("#### ", ""))}
            </h4>
          );
        } else if (trimmed.startsWith("### ")) {
          elements.push(
            <h3 key={index} className="text-lg font-semibold my-1">
              {renderInline(trimmed.replace("### ", ""))}
            </h3>
          );
        } else if (trimmed.startsWith("## ")) {
          elements.push(
            <h2 key={index} className="text-xl font-bold my-2">
              {renderInline(trimmed.replace("## ", ""))}
            </h2>
          );
        } else if (trimmed === "---") {
          elements.push(
            <hr key={index} className="my-2 border-t border-neutral-400" />
          );
        } else if (trimmed !== "") {
          elements.push(
            <p key={index} className={`text-gray-800 my-1 ml-${4 * indentLevel}`}>
              {renderInline(trimmed)}
            </p>
          );
        }
      }
    }
  });

  // Flush remaining list items
  if (listItems.length > 0) {
    elements.push(
      <ul key="ul-end" className="mb-2">
        {listItems}
      </ul>
    );
  }

  return elements;
}

// Handles inline styles
function renderInline(text: string): React.ReactNode[] {
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|`[^`]+`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("__") && part.endsWith("__")) {
      return (
        <u key={index} className="underline">
          {part.slice(2, -2)}
        </u>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="bg-gray-100 text-gray-700 px-1 rounded text-xs font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
