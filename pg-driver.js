const Promise = require('bluebird')

const pg = require('pg-promise')({
    promiseLib: Promise,
})

const client = pg({
    host: "127.0.0.1",
    port: 5432,
    database: "postgres",
});

const insertNpmDownloadData = (packageName, count) =>
{
    var query = pg.as.format(
        "INSERT INTO npm_downloads_count VALUES ($1, $2);",
        [packageName, count]
    );
    return client.oneOrNone(query);
};

const getNpmDownloadData = (packageName) =>
{
    var query = pg.as.format(
        "SELECT * FROM npm_downloads_count WHERE name = $1 LIMIT 1;",
        [packageName]
    );

    return client.any(query);
};

const insertNpmInstallScriptsCheckRecord = (checkId, packageName, version, preinstall, install, postinstall, prepublish, preprepare, prepare, postprepare, gyp, state) =>
{
    var query = pg.as.format("INSERT INTO npm_install_scripts_checker VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT DO NOTHING;", [
        checkId, packageName, version, preinstall, install, postinstall, prepublish, preprepare, prepare, postprepare, gyp, state
    ]);

    return client.oneOrNone(query);
};

const getNpmInstallScriptsCheckRecord = (checkId, packageName) =>
{
    var query = pg.as.format(
        "SELECT * FROM npm_install_scripts_checker WHERE check_id = $1 AND name = $2 LIMIT 1;",
        [checkId, packageName]
    );
    return client.oneOrNone(query);
};

module.exports = {
    insertNpmDownloadData: insertNpmDownloadData,
    getNpmDownloadData: getNpmDownloadData,
    insertNpmInstallScriptsCheckRecord: insertNpmInstallScriptsCheckRecord,
    getNpmInstallScriptsCheckRecord: getNpmInstallScriptsCheckRecord,
    pg: pg,
    client: client,
};
