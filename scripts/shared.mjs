export function argsv(cmds = [], name = '') {
  let args = process.argv;

  let result = args.reduce((acc, arg) => {
    let [cmd, value] = arg.split('=');

    if (cmds.includes(cmd)) {
      acc[cmd] = value;
    }

    return acc;
  }, {});

  if (Object.keys(result).length === 0 || cmds.length === 0) {
    throw new Error(`No arguments provided for script ${name}`);
  }

  return result;
}
