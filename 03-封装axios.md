
>使用环境变量区分开发环境和生产环境要请求的接口URL

```javascript
export const baseURL = process.env.NODE_ENV === 'production'
  ? 'http://production.com'
  : 'http://localhost:3000'

```

封装axios 
```javascript
import axios from 'axios'
import { baseURL } from '@/config'
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}  //队列，空对象
  }
  getInsideConfig () { //全局的配置
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  distroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) { // 拦截器
    instance.interceptors.request.use(config => { // 请求拦截
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show()
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    instance.interceptors.response.use(res => { //响应拦截
      this.distroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      this.distroy(url)
      return Promise.reject(error)
    })
  }
  request (options) { // 传入的配置，最终和全局配置合并
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest



```

使用封装的axios
```javascript
import HttpRequest from '@/lib/axios'
const axios = new HttpRequest()
export default axios  // 导出的axios就是封装过的axios请求

```