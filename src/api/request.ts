import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

class Request {
    private instance: AxiosInstance

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create({
            baseURL: '/api',
            timeout: 10000,
            ...config,
        })

        // 添加请求拦截器
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                // 在发送请求之前做些什么
                return config
            },
            (error: any) => {
                // 对请求错误做些什么
                return Promise.reject(error)
            },
        )

        // 添加响应拦截器
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                // 对响应数据做些什么
                const responseData = response.data

                return responseData
            },
            (error: any) => {
                // 对响应错误做些什么
                console.error('请求错误:', error)
                openErrorModal({ title: '请求错误', content: '错乱了', visible: true })
                if (error.response && error.response.data) {
                    return Promise.reject(error.response.data)
                }
                return Promise.reject(error)
            },
        )
    }

    public async request<T>(config: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.request(config)

        return response.data
    }
}

// 函数
function request<T>(config: AxiosRequestConfig): Promise<T> {
    const instance = new Request(config)

    return instance.request(config)
}

export default request
