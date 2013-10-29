# Adventize Node.js SDK [![Build Status](https://travis-ci.org/adventize/sdk-nodejs.png?branch=master)](https://travis-ci.org/adventize/sdk-nodejs)

Install from npm:

    npm install adventize

Usage:

    var Adventize = require('adventize');

    var api = Adventize.create({
        app_id: [your app id],
        secret_word: [your secret word],
    });

    api.fetch({
        some_param: "[some value]"
    }, function(error, data) {
        if (error) {
            // output error
            console.log(error);
            return;
        }

        // success
        console.log(data);
    });

Required request params listed at [protocol documentation](https://github.com/adventize/server-to-server/blob/master/README.md).