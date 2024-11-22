// i18n配置
import { createI18n } from "vue-i18n";
import zhCn from "./zhCn";
import en from "./en";
export type Language='en'|'zhCn'

export const languageList=[
    {
        key:'zhCn',
        name:'中文',
        flag:'zh-cn'
    },
    {
        key:'en',
        name:'English',
        flag:'en-us'
    }
]
export const browserLanguage=navigator.language.toLowerCase().indexOf('zh')>=0?'zhCn':'en';
const globalConfig=JSON.parse(localStorage.getItem('globalConfig')||'{}').globalConfig||{}
// 创建i18n
const i18n = createI18n({
  locale: globalConfig.language||browserLanguage,
  globalInjection: true, // 全局注入,可以直接使用$t
  legacy:false, 
  messages: {
    zhCn,
    en
  }
})

export default i18n;
