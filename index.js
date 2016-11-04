'use strict';

const config = require('./config.json');
const google = require('googleapis');

const search = google.customsearch('v1');

const Bing = require('node-bing-api')({ accKey: config.bing.api_key });

class ImageSearchProvider {

    _bingSearch(input) {
        let searchKeyword = input.keyword;
        return new Promise((resolve, reject) => {
            Bing.images(searchKeyword, {
                imageFilters: {
                    size: 'large'
                }
            }, function (error, res, body) {
                if (error) resolve(config.default_url);
                else {
                    if (!body.d || 
                    !body.d.results || 
                    !body.d.results.length || 
                    !body.d.results[0] || 
                    !body.d.results[0].MediaUrl) {
                        resolve(config.default_url);
                    } else {
                        resolve(body.d.results[0].MediaUrl);
                    }                            
                }
            });
        });        
    }

    execute(input) {
        let searchKeyword = input.keyword;
        if (input.style) { 
            searchKeyword = searchKeyword + ' ' + input. style;
        }
        return new Promise((resolve, reject) => {            
            search.cse.list({
                auth: config.google.api_key,
                cx: config.google.cx,
                fileType: 'jpg',
                imgSize: 'xxlarge',
                searchType: 'image',
                q: searchKeyword
            }, (err, result) => {
                if (err) {
                    //Most probably free usage ended switch to bing
                    return this._bingSearch(input);
                }
                else {
                    if (result.items && result.items.length > 0 && result.items[0].link) {
                        resolve(result.items[0].link);
                    } else {
                        return this._bingSearch(input);
                    }                    
                }
            });
        });
    }
}


module.exports = ImageSearchProvider;

new ImageSearchProvider().execute({keyword: 'rocketship'});