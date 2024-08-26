/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const execSyncWrapper = (command) => {
  let stdout = null;
  try {
    stdout = execSync(command).toString().trim();
  } catch (error) {
    console.error(error);
  }
  return stdout;
};

const main = () => {
  const gitBranch = execSyncWrapper("git rev-parse --abbrev-ref HEAD");
  const gitCommitHash = execSyncWrapper("git rev-parse HEAD");
  const d = new Date();

  const dateString = d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate();
  const hourString = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

  const obj = {
    gitBranch,
    gitCommitHash,
    dateString,
    hourString,
  };

  const filePath = path.resolve("frontend", "generatedGitInfo.json");
  const fileContents = JSON.stringify(obj, null, 2);

  fs.writeFileSync(filePath, fileContents);
};

main();
