Package.describe({
    "name": "kurounin:pagination-blaze",
    "summary": "Blaze paginator template for kurounin:pagination package.",
    "version": "1.0.5",
    "git": "https://github.com/Kurounin/PaginationBlaze.git"
});

Package.onUse(function (api) {
    api.versionsFrom("METEOR@1.2.1");
    api.use([
        "meteor-base",
        "underscore",
        "kurounin:pagination@1.0.24"
    ]);

    api.use([
        "reactive-var",
        "reactive-dict"
    ], "client");

    api.use([
        "templating",
        "blaze"
    ], "client");

    api.addFiles([
        "client/template.html",
        "client/template.js"
    ], "client");
});