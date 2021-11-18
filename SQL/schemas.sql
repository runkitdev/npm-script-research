CREATE TABLE "npm_downloads_count" (
	"name"	TEXT NOT NULL UNIQUE,
	"downloads"	INTEGER NOT NULL,
	"retrieved_at"	TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "npm_install_scripts_checker" (
	"check_id"	VARCHAR(12) NOT NULL,
	"name"	TEXT NOT NULL,
	"version"	TEXT NOT NULL,
	"preinstall"	BOOLEAN NOT NULL,
	"install"	BOOLEAN NOT NULL,
	"postinstall"	BOOLEAN NOT NULL,
	"prepublish"	BOOLEAN NOT NULL,
	"preprepare"	BOOLEAN NOT NULL,
	"prepare"	BOOLEAN NOT NULL,
	"postprepare"	BOOLEAN NOT NULL,
	"gyp"	BOOLEAN NOT NULL,
	"state"	TEXT,
	PRIMARY KEY("check_id","name","version")
);

