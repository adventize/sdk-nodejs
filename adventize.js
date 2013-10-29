var request = require('request'),
    util = require('util'),
    querystring = require("querystring"),
    crypto = require("crypto").createHash;

var Adventize = (function() {

    var stsApi = function(config) {
        this.config = util._extend({
            host: 'api.adventize.com',
            port: '80',
            app_id: null,
            secret_word: null
        }, config || {});
    };

    stsApi.prototype.getRequestUrl = function(params) {
        if (!params.timestamp) {
            params.timestamp = parseInt(new Date().getTime() / 1000);
        }
        params.app_id = this.config.app_id;
        params.secret = this.generateSignature(params, this.config.secret_word);
        return 'http://'+ this.config.host +':'+ this.config.port +'/fetch/?'+ querystring.stringify(params);
    };

    stsApi.prototype.generateSignature = function(params, secretWord) {
        var hash = [secretWord];
        params.secret = null;
        Object.keys(params).sort().forEach(function(key) {
            var val = params[key];
            if (val && val.toString().length > 0) {
                hash.push(key + val);
            }
        });
        return crypto("sha1").update(hash.join("")).digest("hex");
    };

    stsApi.prototype.fetch = function(params, callback) {
        request.get(this.getRequestUrl(params), function(error, response, body) {

            var status = null,
                data = null,
                message = null;

            try {
                var json = JSON.parse(body);
                if (json.data) {
                    data = json.data;
                }
                if (json.status) {
                    status = json.status;
                }
                if (json.message) {
                    message = json.message;
                }
            } catch (e) {}

            if (status == "error" && typeof callback == 'function') {
                callback(true, message || "Unknown error", {statusCode: response.statusCode});
                return;
            }

            if ((status == "success" || util.isArray(data)) && typeof callback == 'function') {
                var result = [];

                if (!util.isArray(data)) {
                    data = [];
                }

                data.forEach(function(offer) {
                    result.push({
                        offer_id: offer.offer_id || null,
                        offer_description: offer.offer_description || null,
                        name: offer.name || null,
                        url: offer.url || null,
                        icon: offer.icon || null,
                        is_stimulated: offer.is_stimulated || true,
                        is_free: offer.is_free || true,
                        bid: offer.bid || null,
                        currency: offer.currency || null
                    });
                });
                callback(false, result, {statusCode: response.statusCode});

                return;
            }

            if (typeof callback == 'function') {
                callback(true, "Internal server error. Wrong response from server");
            }
        });
    };

    return {
        createApi: function(config) {
            return new stsApi(config);
        }
    };
})();

module.exports = Adventize;