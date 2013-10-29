var request = require('request'),
    fs = require('fs'),
    should = require('should'),
    sinon = require('sinon'),
    adventize = require('../');

var api;

beforeEach(function () {
    api = adventize.createApi({
        app_id: "1",
        secret_word: "test_secret_word"
    });
});

describe('tests adventize server-to-server.', function() {

    it('handle success response', function(done) {

        fs.readFile('./test/test_data/response_success.json', function(error, data) {
            if (error) {
                throw error;
            }

            sinon.stub(request, 'get').yields(false, {statusCode: 200}, data);

            api.fetch({
                some_params: "some values"
            }, function(error, data) {
                if (error) {
                    request.get.restore();
                    done(data);
                    return;
                }

                data.should.be.an.Array;
                data.length.should.be.above(0);

                request.get.restore();
                done();
            });
        });

    });

    it('handle success response #2', function(done) {

        fs.readFile('./test/test_data/response_success_empty_feed.json', function(error, data) {
            if (error) {
                throw error;
            }

            sinon.stub(request, 'get').yields(false, {statusCode: 200}, data);

            api.fetch({
                some_params: "some values"
            }, function(error, data) {
                if (error) {
                    request.get.restore();
                    done(data);
                    return;
                }

                data.should.be.an.Array;
                data.length.should.be.equal(0);

                request.get.restore();
                done();
            });
        });

    });

    it('handle error response', function(done) {

        fs.readFile('./test/test_data/response_error.json', function(error, data) {
            if (error) {
                throw error;
            }

            sinon.stub(request, 'get').yields(false, {statusCode: 500}, data);

            api.fetch({
                some_params: "some values"
            }, function(error, message) {
                error.should.be.an.equal(true);
                message.should.be.an.String;

                request.get.restore();
                done();
            });
        });

    });

    it('handle error response #2', function(done) {

        fs.readFile('./test/test_data/response_not_json.html', function(error, data) {
            if (error) {
                throw error;
            }

            sinon.stub(request, 'get').yields(false, {statusCode: 500}, data);

            api.fetch({
                some_params: "some values"
            }, function(error, message) {
                error.should.be.an.equal(true);
                message.should.startWith('Internal server error');

                request.get.restore();
                done();
            });
        });

    });

});