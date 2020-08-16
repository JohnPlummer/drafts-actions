/*
Uses prettier to format contents of draft
Prettier should be installed glabally `yarn global add prettier`
`prettierFolder` constant should be udpated to point to the install folder
(`which prettier`)
*/

const prettierFolder = "/usr/local/bin";
const fm = FileManager.createLocal();
let tmpFile = "";
let tmpFilePath = "";

formatDraft();

function formatDraft() {
  const supported = setLanguage();
  if (!supported) return;

  writeFile();
  formatFile();
  const formatted = readFile();

  if (formatted) {
    draft.content = formatted;
    draft.update();
  }
  cleanup();
}

function setLanguage() {
  console.log(draft.languageGrammar);
  if (isMarkdown()) tmpFile = "tmp.md";
  if (isJavaScript()) tmpFile = "tmp.js";
  if (tmpFile) {
    tmpFilePath = `${fm.basePath}/${tmpFile}`;
    return true;
  } else {
    console.log(`Unsupported language grammer: ${draft.languageGrammar}`);
    context.fail();
  }
}

function writeFile() {
  const result = fm.writeString(tmpFile, draft.content);
  if (!result) {
    console.log(`Write failed: ${fm.lastError}`);
    context.fail();
  }
  return result;
}

function readFile() {
  const result = fm.readString(tmpFile);
  if (!result) {
    console.log(`Read failed: ${fm.lastError}`);
    context.fail();
  }
  return result;
}

function formatFile() {
  const script = `#!/usr/bin/env bash
export PATH=$2:$PATH
prettier --write "$1"
`;
  const args = [tmpFilePath, prettierFolder];
  return runScript(script, args);
}

function cleanup() {
  const script = `#!/usr/bin/env bash
mv "$1" ~/.Trash/
`;
  const args = [tmpFilePath];
  return runScript(script, args);
}

function runScript(script, args) {
  const runner = ShellScript.create(script);
  if (runner.execute(args)) {
    console.log(`Shell script succeeded: ${runner.standardOutput}`);
    return true;
  } else {
    console.log(`Shell script failed: ${runner.standardError}`);
    context.fail();
  }
}

function isMarkdown() {
  const mdLanguages = [
    "Plain Text",
    "Markdown",
    "MultiMarkdown",
    "GitHub Markdown",
  ];
  return mdLanguages.includes(draft.languageGrammar);
}

function isJavaScript() {
  return draft.languageGrammar === "JavaScript";
}
