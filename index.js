'use strict';

const config = require('./config.json');
const google = require('googleapis');

const search = google.customsearch('v1');

const Bing = require('node-bing-api')({ accKey: config.bing.api_key });

class ImageSearchProvider {
    execute(input) {
        const searchKeyword = input.keyword;
        if (input.style) { 
            searchKeyword = searchKeyword + ' ' + input. style;
        }
        return Promise((resolve, reject) => {            
            search.cse.list({
                auth: config.google.api_key,
                cx: config.google.cx,
                fileType: 'jpg',
                imgSize: 'xxlarge',
                searchType: 'image',
                q: searchKeyword
            }, function (err, result) {
                if (err) {
                    //Most probably free usage ended switch to bing
                    Bing.images(searchKeyword, {
                        imageFilters: {
                            size: 'large'
                        }
                    }, function (error, res, body) {
                        if (error) reject(error)
                        else {
                            resolve(body.d.results[0].MediaUrl);
                        }
                    });
                }
                else {                    
                    resolve(result.items[0].link);
                }
            });
        });
    }
}


module.exports = ImageSearchProvider;