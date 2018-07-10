/*
* 1.引入http方法
* 2.调用POST或GET请求
* 3.待补充
* */
import http from '../src/http'

const API_QINIU_UPLOAD = '//up-z2.qbox.me/'
const API_DEMO_ROUTE = '//api.demo.com/'

const ACTION_DEMO_RERE = 'ACTION_DEMO_RERE'
const ACTION_DEMO_EASY = 'ACTION_DEMO_EASY'
const defaultHeader = {
    'x-token': '',
    'x-app-id': '',
    'x-module': '',
    'x-app-version': '0.0.1',
    'x-system': '',
    'content-type': 'application/json; charset=utf-8',
    'accept': 'application/json'
}

class Demo {
    //自定义 post 请求方法
    static post(url, data, context, action, header) {
        http.POST(url, {
                data: data,
                sign: '',
                timestamp: ''
            },
            {
                onRealSuccess: (data, action, config) => {
                    if (data.code === 0) {
                        //数据获取成功方法
                        console.log('success', data.data, action, config)
                        context.onSuccess(data.data, action, config)
                    } else {
                        //数据获取失败方法
                        console.log('failure', data.code, data.data, action)
                        context.onFailure(data.code, data.data, action)
                    }
                },
                onFailure: context.onFailure,
                onError: context.onError
            }
            , action, defaultHeader)
    }
}


window.onload = () => {
    document.getElementById('title').innerHTML = 'hello webpack';
    document.getElementById('btn').onclick = () => {
        console.log(1)
        Demo.post(API_DEMO_ROUTE, {}, {
            //这里是成功失败错误的返回方法
        }, ACTION_DEMO_RERE)
    }
    //普通请求
    document.getElementById('btn2').onclick = () => {
        http.POST(API_QINIU_UPLOAD, {
            data: {},
            sign: '',
            timestamp: ''
        }, {
            onSuccess: (data, action, config) => {
                console.log('success', data, action, config)
            },
            onFailure: (code, data, action) => {
                console.log('failure', code, data, action)
            },
            onError: (status, action) => {
                console.log('error', status, action)
            }
        }, ACTION_DEMO_EASY, {'Content-Type': undefined})
    }
}
window.onload()