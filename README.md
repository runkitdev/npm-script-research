# npm Package Research: Packages with Install Scripts

This repo's goal is to provide data to support [RFC 488](https://github.com/npm/rfcs/pull/488). Data to determine how packages on the npm registry use install scripts was collected on or before November 18, 2021.

Install scripts are defined on the [npm lifecycle page](https://docs.npmjs.com/cli/v7/using-npm/scripts/#npm-install):

* preinstall
* install
* postinstall
* prepublish
* preprepare
* prepare
* postprepare
* The implicit gyp install script, when a `binding.gyp` file is present.

## Files

* [`database.db`](./database.db): A SQLite3 database containing data about every npm package that has at least one install script.

* [`./SQL/schemas.sql`](./SQL/schemas.sql): The CREATE table commands for the two database tables in `database.db`.
* [`./SQL/totals.sql`](./SQL/totals.sql): Useful commands for counting the number of packages using specific install scripts.
* [`./SQL/join.sql`](./SQL/join.sql): Useful command for sorting the most popular packages to use install scripts.
