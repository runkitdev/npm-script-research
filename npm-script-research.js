const got = require("got");
const R = require("ramda");
const Promise = require("bluebird");

const data = require("./data.json");

const { insertNpmDownloadData, getNpmDownloadData } = require("./pg-driver");

function load()
{
    const columns = ["name", "version", "preinstall", "install", "postinstall", "prepublish", "preprepare", "prepare", "postprepare", "gyp", "state"];
    return R.map(row => R.fromPairs(R.zip(columns, row)), data);
}

const LIMIT = 64;

async function getPackageData(rows)
{
    const fetchedData = await fetchDataForPackages(rows);

    return Promise.map(fetchedData, (record) => {
        return insertNpmDownloadData(record.package, record.downloads);
    });
}

async function fetchDataForPackage(row)
{
    const url = apiEndpoint(row.name);

    try
    {
        const response = await got(url).json();
        return [response];
    }
    catch (err)
    {
        if (err.message === "Response code 404 (Not Found)")
            return [{ package: row.name, downloads: 0 }];

        else
            throw err;
    }
}

async function fetchDataForPackages(rows)
{
    if (rows.length < 1)
        return [];
    if (rows.length === 1)
        return fetchDataForPackage(rows[0]);

    const url = apiEndpoint(R.pluck("name", rows));

    // console.log("url", url);
    const response = await got(url).json();

    return R.map(([packageName, data]) => {
        let result = data;
        if (data === null)
            result = { package: packageName, downloads: 0 };
        return result;
    }, R.toPairs(response));
}

async function upsertPackageData(rows)
{
    // check if row already exists
    const result = await getPackageData(rows);
    await Promise.delay(1000);
}

async function main()
{
    const d = load();
    let packageGroup = [];

    for (var i = 0; i < d.length; i++)
    {
        const row = d[i];

        const existingRow = await getNpmDownloadData(row.name);
        if (existingRow)
        {
            console.log(`Found existing record for ${row.name}. Skipping…`);
            continue;
        }

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
