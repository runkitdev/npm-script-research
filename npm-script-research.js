const got = require("got");
const R = require("ramda");
const Promise = require("bluebird");

const data = require("./data.json");

function load()
{
    const columns = ["check_id", "name", "version", "preinstall", "install", "postinstall", "prepublish", "preprepare", "prepare", "postprepare", "gyp", "state"];
    return R.map(row => R.fromPairs(R.zip(columns, row)), data);
}

const LIMIT = 64;

async function getPackageData(rows)
{
    const url = apiEndpoint(R.pluck("name", rows));
    console.log(url);
    try
    {
        const response = await got(url).json();
        return response;
    }
    catch (err)
    {
        if (err.message === "Response code 404 (Not Found)")
            return R.fromPairs(R.map((r) => [r.name, { package: r.name, downloads: 0 }], rows));

        else
            throw err;
    }
}

async function upsertPackageData(rows)
{
    // check if row already exists
    const result = await getPackageData(rows);
    console.log(result);
    await Promise.delay(1000);
}

async function main()
{
    const d = load();
    let packageGroup = [];

    for (var i = 0; i < d.length; i++)
    {
        const row = d[i];
        // scoped package
        if (row.name.charAt(0) === "@")
        {
            await upsertPackageData([row]);
        }
        else
        {
            packageGroup.push(row);
        }

        if (packageGroup.length >= LIMIT)
        {
            await upsertPackageData(packageGroup);
            packageGroup = [];
        }
    }

    await upsertPackageData(packageGroup);
}

function apiEndpoint(packages)
{
    let url = "https://api.npmjs.org/downloads/point/last-month/";
    if (R.is(String, packages))
        return url += packages;
    return url += packages.join(",");
}

main();

// https://api.npmjs.org/downloads/point/last-month/@slack/client
// https://api.npmjs.org/downloads/point/last-day/npm,express
