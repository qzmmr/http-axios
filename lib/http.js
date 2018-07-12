'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STATUS_SUCCESS = 200;
var defaultHeader = { 'accept': 'application/json; charset=utf-8' };

_es6Promise2.default.polyfill();

var http = {
    POST: function POST(url, data, context, action) {
        var header = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : defaultHeader;

        (0, _axios2.default)({
            method: 'post',
            url: url,
            data: data,
            headers: header
        }).then(function (res) {
            if (res['status'] === STATUS_SUCCESS) {
                context.onRealSuccess ? context.onRealSuccess(res['data'], action, data) : context.onSuccess(res['data'], action, data);
            } else {
                context.onFailure(res['data'], action);
            }
        }).catch(function (e) {
            try {
                context.onError(e.response.status, action, data);
            } catch (exception) {
                throw e;
            }
        });
    },

    GET: function GET(url, success, error, action) {
        _axios2.default.get(url).then(function (res) {
            success(res, action);
        }).catch(function (e) {
            try {
                error ? error(e.response.status, action) : null;
            } catch (exception) {
                throw e;
            }
        });
    }
};
exports.default = http;