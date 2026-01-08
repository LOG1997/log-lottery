import type { IMsgType } from '@/types/msgType'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { api_sendMsg } from '@/api/msg'
import { IndexDb } from '@/utils/dexie'

export function useViewModel() {
    const toast = useToast()
    const route = useRoute()
    const routeSignature = ref<string>('')
    const userInputMsg = ref('')
    const userMsgArray = ref<any[]>([])
    const userMsgDb = new IndexDb('userMsg', ['userMsg'], 1, ['createTime'])
    const getRouteSignature = async () => {
        routeSignature.value = route.query.userSignature as string
    }

    const getAllMsg = async () => {
        userMsgDb.getDataSortedByDateTime('userMsg', 'dateTime').then((data) => {
            userMsgArray.value = data
        })
    }

    function sendMsg(msg: string) {
        const msgData: IMsgType = {
            msg,
            dateTime: new Date().toLocaleString(),
        }
        api_sendMsg(routeSignature.value, msgData).then((res: any) => {
            toast.open({
                message: res.msg || '发送成功',
                type: 'success',
                position: 'top-right',
            })
            userMsgDb.setData('userMsg', { msg })
            getAllMsg()
            userInputMsg.value = ''
        })
    }
    onMounted(() => {
        getRouteSignature()
        getAllMsg()
    })
    return {
        sendMsg,
        userInputMsg,
        userMsgArray,
    }
}
