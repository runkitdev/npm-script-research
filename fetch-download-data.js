const got = require("got");
const R = require("ramda");
const Promise = require("bluebird");
const moment = require("moment");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const LIMIT = 64;

async function getPackageData(rows)
{
    const fetchedData = await fetchDataForPackages(rows);

    return Promise.map(fetchedData, (record) => {
        return prisma.npm_downloads_count.create({
            data: {
                name: record.package,
                downloads: record.downloads,
                retrieved_at: moment().format("YYYY-MM-DD")
            },
        });
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

    const response = await got(url).json();

    return R.map(([packageName, data]) => {
        let result = data;
        if (data === null)
            result = { package: packageName, downloads: 0 };
        return result;
    }, R.toPairs(response));
}

async function main()
{
    const npmDownloads = await prisma.npm_install_scripts_checker.findMany();

    let packageGroup = [];

    for (var i = 0; i < npmDownloads.length; i++)
    {
        const record = npmDownloads[i];

        const existingRow = await prisma.npm_downloads_count.findUnique({
            where: { name: record.name }
        });

        if (existingRow)
        {
            console.log(`Found existing record for ${existingRow.name}. Skipping…`);
            continue;
        }

        // scoped package
        // https://api.npmjs.org/downloads/point/last-month/@slack/client
        if (record.name.charAt(0) === "@")
        {
            await getPackageData([record]);
        }
        else
        {
            packageGroup.push(record);
        }

        // for non-scoped packages, we can request data for up to 128 packages at a time.
        // to be safe, I use a LIMIT of 64
        // https://api.npmjs.org/downloads/point/last-day/npm,express
        if (packageGroup.length >= LIMIT)
        {
            await getPackageData(packageGroup);
            packageGroup = [];
        }
    }

    await getPackageData(packageGroup);
}

function apiEndpoint(packages)
{
    let url = "https://api.npmjs.org/downloads/point/last-month/";
    if (R.is(String, packages))
        return url += packages;
    return url += packages.join(",");
}

main();
