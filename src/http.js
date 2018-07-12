import axios from 'axios'
import promise from 'es6-promise';

const STATUS_SUCCESS = 200
const defaultHeader = {'accept': 'application/json; charset=utf-8'}

promise.polyfill();

const http = {
    POST: (url, data, context, action, header = defaultHeader) => {
        axios({
            method: 'post',
            url: url,
            data: data,
            headers: header
        })
            .then((res) => {
                if (res['status'] === STATUS_SUCCESS) {
                    context.onRealSuccess ?
                        context.onRealSuccess(res['data'], action, data)
                        : context.onSuccess(res['data'], action, data)

                }
                else {
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
    },

    GET: (url, success, error, action) => {
        axios.get(url).then((res) => {
            success(res, action)
        }).catch((e) => {
            try {
                error ? error(e.response.status, action) : null
            } catch (exception) {
                throw e
            }

        })
    }
}
export default http
