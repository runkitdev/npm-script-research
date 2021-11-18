-- Join packages with install scripts and the table counting downloads so we can see how popular they are

SELECT
  npm_downloads_count.name,
  npm_downloads_count.downloads,
  npm_install_scripts_checker.preinstall,
  npm_install_scripts_checker.install,
  npm_install_scripts_checker.postinstall,
  npm_install_scripts_checker.prepublish,
  npm_install_scripts_checker.preprepare,
  npm_install_scripts_checker.prepare,
  npm_install_scripts_checker.postprepare,
  npm_install_scripts_checker.gyp
FROM npm_downloads_count
INNER JOIN npm_install_scripts_checker ON npm_downloads_count.name = npm_install_scripts_checker.name
ORDER BY npm_downloads_count.downloads DESC
LIMIT 50;
