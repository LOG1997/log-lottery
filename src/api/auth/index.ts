import request from '../request'

export function api_auth(data: any) {
    return request<{ status: string }>({
        url: 'http://127.0.0.1:8080/api/auth',
        method: 'POST',
        data,
    })
}
