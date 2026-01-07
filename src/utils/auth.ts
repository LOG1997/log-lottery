import FingerprintJS from '@fingerprintjs/fingerprintjs'

export function getToken() {
    return window.localStorage.getItem('userToken')
}

/**
 * 获取用户浏览器唯一标识
 * @returns {Promise<string>} 唯一标识符
 */
export async function getUniqueSignature() {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    return result.visitorId
}

// 获取origin url
export function getOriginUrl() {
    return window.location.origin
}
