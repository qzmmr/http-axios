import md5 from 'md5'
import axios from 'axios'
import promise from 'es6-promise';

export const STATUS_SUCCESS = 200
export const STATUS_OTHER_LOGIN = 300
export const STATUS_USER_FORBIDDEN = 400
export const STATUS_SYSTEM_ERROR = 500
export const STATUS_API_DEBUG = 501
export const STATUS_APP_DEBUG = 502
export const STATUS_LOW_VERSION = 503
export const CODE_SUCCESS_TYPE1 = 0
export const CODE_SUCCESS_TYPE2 = 'success'


promise.polyfill();

const HTTP_METHOD_POST = 'POST'


export default (
    () => {
    let httpHook
    let secret = ''
    let token = ''
    let app_id = ''
    let version = '0.0.1'
    let module = 'PUB'
    let content_type = 'application/json; charset=utf-8'
    let accept = 'application/json'
    let system = ''

    let headers = () => {
        return {
            'x-token': typeof token === "function" ? token() : token,
            'x-app-id': app_id,
            'x-module': module,
            'x-app-version': version,
            'x-system': system,
            'content-type': content_type,
            'accept': accept
        }
    }

    let sign = (data, timestamp) => {
        let data1 = (JSON.stringify(data));
        let data2 = data1 + secret
        let data3 = md5(data2)
        let data4 = data3 + timestamp
        let data5 = md5(data4)
        return data5
    }

    let filterEmpty = (data) => {
        for (let key in data) {
            if (data[key] === -1 || data[key] === '') {
                delete data[key]
            }
        }
        return data
    }

    let constructData = (data) => {
        let timestamp = (new Date()).valueOf();
        data = {
            data: data,
            timestamp: (new Date()).valueOf(),
            sign: sign(data, timestamp)
        }
        return JSON.stringify(data)
    }

    let filteUrl = (url) => {
        if (typeof url === 'function') {
            url = url()
        }
        return url
    }

    let kmRequest = (url, data, success, failure, error, action = '') => {
        url = filteUrl(url)
        data = filterEmpty(data)
        data = constructData(data)
        let config = () => {
            return {
                url: url,
                method: HTTP_METHOD_POST,
                data: data,
                headers: headers()
            }
        }
        let sendConfig = config()
        axios(config()).then((res) => {
            if (res['data']['code'] === CODE_SUCCESS_TYPE1 || res['data']['code'] === CODE_SUCCESS_TYPE2) {
                success(res['data']['data'], action, sendConfig)
            } else {
                failure(res['data']['code'], res['data'], action, sendConfig
                )
            }
        }).catch((e) => {
            try {
                error ? error(e.response.status, action, sendConfig) : null
                httpHook ? httpHook(e.response.status, action, sendConfig) : null
            } catch (exception) {
                error ? error(e.response.status, action, sendConfig) : null
                throw e
            }
        })
    }

    return {
        setHeader: (x_app_id, app_secret, x_module = '', x_version = '', x_system = '') => {
            app_id = x_app_id ? x_app_id : app_id
            secret = app_secret ? app_secret : secret
            module = x_module ? x_module : module
            version = x_version ? x_version : version
            system = x_system ? x_system : system
        },
        setHttpHook: (hook) => {
            httpHook = hook
        },
        setToken: (x_token) => {
            token = x_token
        },
        http: axios,
        httpPost: (url, data, success, failure, error, action) => {
            kmRequest(url, data, success, failure, error, action)
        },
        httpGet: (url, success, error, action) => {
            axios.get(url).then((res) => {
                success(res, action)
            }).catch((e) => {
                try {
                    error ? error(e.response.status, action) : null
                } catch (exception) {
                    throw e
                }

            })
        },
        POST: (url, data, context, action, header = {'accept': 'application/json; charset=utf-8'}) => {
            axios({
                method: 'post',
                url: url,
                data: data,
                headers: header
            })
                .then((res) => {
                    if (res['status'] === 200) {
                        context.onRealSuccess ? context.onRealSuccess(res['data'], action, data) : context.onSuccess(res['data'], action, data)

                    } else {
                        context.onFailure(res['data'], action)
                    }
                })
                .catch((e) => {
                    try {
                        context.onError(e.response.status, action, data)
                    } catch (exception) {
                        throw e
                    }
                })
        }
    }
})()
