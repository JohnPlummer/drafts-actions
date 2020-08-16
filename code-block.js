// Apply Markdown code to selection, or insert ``` if no selection

const sel = editor.getSelectedText();
const selRange = editor.getSelectedRange();
const multiStart = "```\n";
const multiEnd = "\n```";
const single = "`";

if (isTextSelected()) {
  isMultiline()
    ? surroundText(multiStart, multiEnd)
    : surroundText(single, single);
} else {
  insertText(multiStart);
}

function isTextSelected() {
  return sel && sel.length > 0;
}

function isMultiline() {
  return sel.includes("\n");
}

function surroundText(start, end) {
  editor.setSelectedText(`${start}${sel}${end}`);
  editor.setSelectedRange(selRange[0] + start.length - 1, 0);
}

function insertText(text) {
  editor.setSelectedText(text);
  editor.setSelectedRange(selRange[0] + text.length, 0);
}
