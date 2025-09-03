import { parseArgs, ParseArgsConfig } from "util";

const parseOptions: ParseArgsConfig = {
  strict: false,
  options: {
    "output-error-response": {
      type: "boolean",
    },
  },
};

let flagCache: boolean | undefined = undefined;

export function getOutputFlag() {
  if (flagCache !== undefined) {
    return flagCache;
  }
  const { values } = parseArgs(parseOptions);
  flagCache = "output-error-response" in values;
  return flagCache;
}
