var request = require('request'),
    util = require('util');

var Adventize = (function() {

    var stsApi = function(config) {
        this.config = config;
    };

    stsApi.prototype.fetch = function(params, callback) {
        request.get('http://api.adventize.com/fetch/?', function(error, response, body) {

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
                callback(true, "Internal server error. Wrong response from server",
                    {statusCode: response.statusCode});
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