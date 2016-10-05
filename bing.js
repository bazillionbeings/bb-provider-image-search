'use strict';

const Bing = require('node-bing-api')({ accKey: 'kqz/1Dt910YWxJ/s4sp1vORvLT4YV4FQwjmQ2OpR2tE' });

Bing.images('sun', {
    imageFilters: {
        size: 'large'
    }
}, function (error, res, body) {
    if (error) conosle.error(error);
    else {
        console.log(JSON.stringify(body));
    }
});