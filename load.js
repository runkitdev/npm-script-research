const R = require("ramda");
const { getNpmInstallScriptsCheckRecord, insertNpmInstallScriptsCheckRecord } = require("./pg-driver");
const data = require("./data.json");

const checkId = "i8h98vj2j4c2";

function load()
{
    const columns = ["name", "version", "preinstall", "install", "postinstall", "prepublish", "preprepare", "prepare", "postprepare", "gyp", "state"];
    return R.map(row => R.fromPairs(R.zip(columns, row)), data);
}

async function main()
{
    const d = load();
    let packageGroup = [];

    for (var i = 0; i < d.length; i++)
    {
        const row = d[i];

        const { name, version, preinstall, install, postinstall, prepublish, preprepare, prepare, postprepare, gyp, state } = row;

        const existing = await getNpmInstallScriptsCheckRecord(checkId, name);

        if (!existing)
            await insertNpmInstallScriptsCheckRecord(checkId, name, version, preinstall, install, postinstall, prepublish, preprepare, prepare, postprepare, gyp, state);
    }
}

main();
