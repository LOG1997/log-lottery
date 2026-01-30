import request from '../request'

export function api_sendMsg(userSignature: string, data: any) {
    return request<{ status: string }>({
        url: '/user-msg',
        method: 'POST',
        headers: {
            user_signature: userSignature,
        },
        data,
    })
}
