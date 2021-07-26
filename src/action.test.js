beforeEach(() => {
  process.exitCode = 0;
  process.stdout.write = jest.fn();
});

test("action errors when threshold is not an int", async () => {
  const { action } = require("./action");
  process.env.INPUT_PATH = "./src/fixtures/partial_coverage.xml";
  process.env.INPUT_BRANCH_MINIMUM_THRESHOLD = "bob";

  await action();

  expect(process.exitCode).toBe(1);
  expect(process.stdout.write).toHaveBeenCalledTimes(1);
  expect(process.stdout.write).toHaveBeenCalledWith(
    expect.stringContaining(
      "::error::branch_minimum_threshold must be an int is actually 'bob'"
    )
  );
});

test("action errors when threshold is not an int", async () => {
  const { action } = require("./action");
  process.env.INPUT_PATH = "./src/fixtures/partial_coverage.xml";
  process.env.INPUT_BRANCH_MINIMUM_THRESHOLD = "bob";

  await action();

  expect(process.exitCode).toBe(1);
  expect(process.stdout.write).toHaveBeenCalledTimes(1);
  expect(process.stdout.write).toHaveBeenCalledWith(
    expect.stringContaining(
      "::error::branch_minimum_threshold must be an int is actually 'bob'"
    )
  );
});

test("action errors when threshold is < 0", async () => {
  const { action } = require("./action");
  process.env.INPUT_PATH = "./src/fixtures/partial_coverage.xml";
  process.env.INPUT_BRANCH_MINIMUM_THRESHOLD = "-10";

  await action();

  expect(process.exitCode).toBe(1);
  expect(process.stdout.write).toHaveBeenCalledTimes(1);
  expect(process.stdout.write).toHaveBeenCalledWith(
    expect.stringContaining(
      "::error::branch_minimum_threshold must be an between 0 and 100 is actually '-10'"
    )
  );
});

test("action errors when threshold is > 100", async () => {
  const { action } = require("./action");
  process.env.INPUT_PATH = "./src/fixtures/partial_coverage.xml";
  process.env.INPUT_BRANCH_MINIMUM_THRESHOLD = "101";

  await action();

  expect(process.exitCode).toBe(1);
  expect(process.stdout.write).toHaveBeenCalledTimes(1);
  expect(process.stdout.write).toHaveBeenCalledWith(
    expect.stringContaining(
      "::error::branch_minimum_threshold must be an between 0 and 100 is actually '101'"
    )
  );
});

test("full coverage doesn't error when threshold is 100", async () => {
  const { action } = require("./action");
  process.env.INPUT_PATH = "./src/fixtures/full_coverage.xml";
  process.env.INPUT_BRANCH_MINIMUM_THRESHOLD = "100";

  await action();

  expect(process.exitCode).toBe(0);
  expect(process.stdout.write).toHaveBeenCalledTimes(0);
});

test("partial coverage does error when threshold is 100", async () => {
  const { action } = require("./action");
  process.env.INPUT_PATH = "./src/fixtures/partial_coverage.xml";
  process.env.INPUT_BRANCH_MINIMUM_THRESHOLD = "100";

  await action();

  expect(process.exitCode).toBe(1);
  expect(process.stdout.write).toHaveBeenCalledTimes(1);
  expect(process.stdout.write).toHaveBeenCalledWith(
    expect.stringContaining(
      "::error::Failure to hit branch coverage threshold '100' actual branch coverage is '16.66'"
    )
  );
});

test("partial coverage (16.6%) does not error when threshold is 10", async () => {
  const { action } = require("./action");
  process.env.INPUT_PATH = "./src/fixtures/partial_coverage.xml";
  process.env.INPUT_BRANCH_MINIMUM_THRESHOLD = "10";

  await action();

  expect(process.exitCode).toBe(0);
  expect(process.stdout.write).toHaveBeenCalledTimes(0);
});
