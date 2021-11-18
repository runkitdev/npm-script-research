-- Question: how common is it to have both prepublish and prepare scripts?
SELECT
  npm_downloads_count.name,
  npm_downloads_count.downloads,
  npm_install_scripts_checker.prepublish,
  npm_install_scripts_checker.prepare
FROM npm_downloads_count
INNER JOIN npm_install_scripts_checker ON npm_downloads_count.name = npm_install_scripts_checker.name
WHERE (npm_install_scripts_checker.prepublish = true AND npm_install_scripts_checker.prepare = true)
ORDER BY npm_downloads_count.downloads DESC;

-- Disabled Counts
SELECT COUNT(*) as total FROM npm_install_scripts_checker WHERE state != 'disabled';
SELECT COUNT(*) AS total_scripts FROM npm_install_scripts_checker WHERE (preinstall = true OR install = true OR postinstall = true OR gyp = true) AND state!= 'disabled';
SELECT COUNT(*) as preinstall FROM npm_install_scripts_checker WHERE preinstall = true AND state != 'disabled';
SELECT COUNT(*) as install FROM npm_install_scripts_checker WHERE install = true AND state != 'disabled';
SELECT COUNT(*) as postinstall FROM npm_install_scripts_checker WHERE postinstall = true AND state != 'disabled';
SELECT COUNT(*) as prepublish FROM npm_install_scripts_checker WHERE prepublish = true AND state != 'disabled';
SELECT COUNT(*) as preprepare FROM npm_install_scripts_checker WHERE preprepare = true AND state != 'disabled';
SELECT COUNT(*) as prepare FROM npm_install_scripts_checker WHERE prepare = true AND state != 'disabled';
SELECT COUNT(*) as postprepare FROM npm_install_scripts_checker WHERE postprepare = true AND state != 'disabled';
SELECT COUNT(*) as gyp FROM npm_install_scripts_checker WHERE gyp = true AND state != 'disabled';
