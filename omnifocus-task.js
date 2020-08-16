let newContent = draft.content;
transferTasksToOF();

function transferTasksToOF() {
    draft.lines.forEach(function (line) {
    if (line.startsWith("- [ ]")) processTask(line);
  });

  draft.content = newContent;
  draft.update();
}

function processTask(line) {
  const taskLink = createOFTask(taskpaper(line));
  const replacementLine = updateLine(line, taskLink);
  newContent = newContent.replace(line, replacementLine);
}

function createOFTask(taskpaper) {
  const cb = CallbackURL.create();
  cb.baseURL = "omnifocus://x-callback-url/paste";
  cb.addParameter("content", taskpaper);

  let response = call(cb);
  if (response) return response.result;
}

function taskpaper(line) {
  const task = line.replace("[ ]", "").trim();
  const note = `Created from ${draft.permalink}`;
  return `${task}\n${note}`;
}

function call(callbackURL) {
  const success = callbackURL.open();
  if (success) return callbackURL.callbackResponse;

  console.log(`callback failed with status ${callbackURL.status}`);
  callbackURL.status == "cancel" ? context.cancel() : context.fail();
}

function updateLine(line, taskLink) {
  line = line + ` - [(OF)](${taskLink})`;
  line = line.replace("- [ ]", "- ");
  return line;
}


/*
Taskpaper format
- Task name here @parallel(true) @autodone(false) @context(Communications : ☎️@Calls) @tags(Communications : ☎️@Calls) @due(2021-01-12 17:00) @defer(2020-12-01 07:00) @time-zone(current) @repeat-method(fixed) @repeat-rule(FREQ=YEARLY)
  Task note here
  and here
*/
