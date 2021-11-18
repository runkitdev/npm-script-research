const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Promise = require("bluebird");
const R = require("ramda");

async function summarize()
{
    const installScriptTypes = [
        "preinstall",
        "install",
        "postinstall",
        "prepublish",
        "preprepare",
        "prepare",
        "postprepare",
        "gyp",
    ];

    const aggregations = await Promise.map(installScriptTypes, async (scriptType) =>
    {
        const query = {
            where: { NOT: { state: { equals: 'disabled' } } },
            _count: { name: true },
        };

        query.where[scriptType] = { equals: true };

        const result = await prisma.npm_install_scripts_checker.aggregate(query);

        const lens = R.lensPath(["_count", "name"]);
        return [scriptType, R.view(lens, result)];
    })
    return R.fromPairs(aggregations);
}

async function npmScriptResearch()
{
    const result = await summarize();
    console.log(result);
}

npmScriptResearch();
