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
    console.log('config.url',config.url)
    if(config.url.indexOf('/dashboard')!==-1){
      config.baseURL = process.env.VUE_APP_BASE_REPORT
    }else if(config.url.indexOf('/auth')!==-1){
      config.baseURL= process.env.VUE_APP_HTTP_AUTH
    }else{
			config.baseURL= process.env.VUE_APP_HTTP_MG
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
		if(error.response.status===401){
			MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
				confirmButtonText: 'Re-Login',
				cancelButtonText: 'Cancel',
				type: 'warning'
			}).then(() => {
				store.dispatch('user/resetToken').then(() => {
					location.reload()
				})
			})
		}else{
			Message({
				message: '服务器错误',
				type: 'error',
				duration: 5 * 1000
			})
		}
    return Promise.reject(error)
  }
)

export default service
