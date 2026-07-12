import type { KeyboardEvent } from "react";

const NUMBERED_LINE = /^(\s*)(\d+)([.)])\s(.*)$/;
const BULLET_LINE = /^(\s*)([-*•])\s(.*)$/;

/**
 * Continues numbered ("1.") or bulleted ("-"/"•") lines on Enter, and
 * removes the prefix (ending the list) when Enter is pressed on an
 * otherwise-empty list item.
 */
export function handleAutoListKeyDown(
  event: KeyboardEvent<HTMLTextAreaElement>
) {
  if (event.key !== "Enter") return;

  const textarea = event.currentTarget;
  const { value, selectionStart, selectionEnd } = textarea;
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const currentLine = value.slice(lineStart, selectionStart);

  const numbered = currentLine.match(NUMBERED_LINE);
  const bullet = currentLine.match(BULLET_LINE);
  const match = numbered ?? bullet;
  if (!match) return;

  event.preventDefault();

  const isEmptyItem = match[match.length - 1].trim() === "";
  if (isEmptyItem) {
    const newValue = value.slice(0, lineStart) + value.slice(selectionStart);
    textarea.value = newValue;
    textarea.selectionStart = textarea.selectionEnd = lineStart;
    return;
  }

  const indent = match[1];
  const prefix = numbered
    ? `\n${indent}${parseInt(numbered[2], 10) + 1}${numbered[3]} `
    : `\n${indent}${bullet![2]} `;

  const newValue = value.slice(0, selectionStart) + prefix + value.slice(selectionEnd);
  textarea.value = newValue;
  const cursor = selectionStart + prefix.length;
  textarea.selectionStart = textarea.selectionEnd = cursor;
}
