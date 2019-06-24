import axios from 'axios'
import { Message,MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  timeout: 5000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] ='Bearer '+getToken()
    }
    let HTTP_AUTH=`http://${document.location.hostname}${process.env.VUE_APP_HTTP_AUTH}`
    let HTTP_AUTH_AGENT=`http://${document.location.hostname}${process.env.VUE_APP_HTTP_AUTH_AGENT}`
		if(process.env.NODE_ENV=== 'development') {
			HTTP_AUTH = process.env.VUE_APP_HTTP_AUTH
			HTTP_AUTH_AGENT = process.env.VUE_APP_HTTP_AUTH_AGENT
		}
		if(config.url.indexOf('/auth')!==-1){
			config.baseURL=HTTP_AUTH
		}else{
			config.baseURL= HTTP_AUTH_AGENT
		}
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */
  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
		const res = response.data
		return res
	},
  error => {
		console.log(error.response)
		const {msg,status} =error.response?error.response.data:{msg:'服务器故障错误',status:500}
		switch (status) {
			case 401:
				MessageBox.confirm('登陆超时,请重新登录!', '重新登录', {
					type: 'warning'
				}).then(() => {
					store.dispatch('user/resetToken').then(() => {
						location.href='#/login'
					})
				})
				break
			default:
				Message({
					message: msg,
					type: 'error',
					duration: 5 * 1000
				})
				break
		}
		return Promise.reject(error)
	})

export default service
