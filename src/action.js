const core = require("@actions/core");
const xml2js = require("xml2js");
const util = require("util");
const fs = require("fs").promises;

const parseString = util.promisify(xml2js.parseString);

async function action() {
  const branchThreshold = parseInt(core.getInput("branch_minimum_threshold"));

  if (isNaN(branchThreshold)) {
    core.setFailed(
      `branch_minimum_threshold must be an int is actually '${core.getInput(
        "branch_minimum_threshold"
      )}'`
    );
    return;
  }

  if (branchThreshold > 100 || branchThreshold < 0) {
    core.setFailed(
      `branch_minimum_threshold must be an between 0 and 100 is actually '${branchThreshold}'`
    );
    return;
  }

  const filePath = core.getInput("path");
  const data = await fs.readFile(filePath);
  const result = await parseString(data);

  const branchCoverage = result.coverage.$["branch-rate"] * 100;
  if (branchCoverage < branchThreshold) {
    core.setFailed(
      `Failure to hit branch coverage threshold '${branchThreshold}' actual branch coverage is '${branchCoverage}'`
    );
  }
}

module.exports = {
  action,
};
