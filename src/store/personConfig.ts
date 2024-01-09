import { defineStore } from 'pinia';
import { IPersonConfig } from '@/types/personConfig';
import { IPrizeConfig } from '@/types/prizeConfig';
import {defaultPersonList} from './data'
export const usePersonConfig = defineStore('person', {
    state() {
        return {
            personConfig: {
                allPersonList: [] as IPersonConfig[],
                // alreadyPersonList: [] as IPersonConfig[],
                // notPersonList: [] as IPersonConfig[],
                tableRowCount: 12,
                showField: [] as any[]
            }
        };
    },
    getters: {
        // 获取全部配置
        getPersonConfig(state) {
            return state.personConfig;
        },
        // 获取全部人员名单
        getAllPersonList(state) {
            return state.personConfig.allPersonList;
        },
        // 获取已中奖人员名单
        getAlreadyPersonList(state) {
            return state.personConfig.allPersonList.filter((item: IPersonConfig) => {
                return item.isWin === true;
            });
        },
        // 获取未中奖人员名单
        getNotPersonList(state) {
            return state.personConfig.allPersonList.filter((item: IPersonConfig) => {
                return item.isWin === false;
            });
        },
        // 获取table列数
        getTableRowCount(state) {
            return state.personConfig.tableRowCount;
        },
        // 获取要展示那些字段
        getShowField(state) {
            return state.personConfig.showField;
        }
    },
    actions: {
        // 添加未中奖人员
        addNotPersonList(personList: IPersonConfig[]) {
            if (personList.length <= 0) {
                return
            }
            personList.forEach((item: IPersonConfig) => {
                this.personConfig.allPersonList.push(item);
            });
        },
        // 添加已中奖人员
        addAlreadyPersonList(personList: IPersonConfig[], prize: IPrizeConfig | null) {
            if (personList.length <= 0) {
                return
            }
            personList.forEach((person: IPersonConfig) => {
                this.personConfig.allPersonList.map((item: IPersonConfig) => {
                    if (item.id === person.id&&prize!=null) {
                        item.isWin = true
                        item.prizeName = prize.name
                        item.prizeTime = new Date().toString()
                    }
                });
            });
        },
        // 从已中奖移动到未中奖
        moveAlreadyToNot(person: IPersonConfig) {
            if (person.id != undefined || person.id != null) {
                for(let i=0;i<this.personConfig.allPersonList.length;i++){
                    if(person.id === this.personConfig.allPersonList[i].id){
                        this.personConfig.allPersonList[i].isWin=false
                        this.personConfig.allPersonList[i].prizeName=''
                        this.personConfig.allPersonList[i].prizeTime=''
                        
return
                    }
                }
            }
        },
        // 删除指定人员
        deletePerson(person: IPersonConfig) {
            if (person.id != undefined || person.id != null) {
                this.personConfig.allPersonList = this.personConfig.allPersonList.filter((item: IPersonConfig) => item.id !== person.id);
            }
        },
        // 删除所有人员
        deleteAllPerson() {
            this.personConfig.allPersonList = [];
        },

        // 重置所有人员
        resetPerson() {
            this.personConfig.allPersonList = [];
        },
        // 重置已中奖人员
        resetAlreadyPerson() {
            // 把已中奖人员合并到未中奖人员，要验证是否已存在
            this.personConfig.allPersonList.forEach((item: IPersonConfig) => {
               item.isWin = false;
            });
        },
        setDefaultPersonList() {
            this.personConfig.allPersonList = defaultPersonList;
        },
        // 重置所有配置
        reset() {
            this.personConfig = {
                allPersonList: [] as IPersonConfig[],
                tableRowCount: 12,
                showField: [] as string[]
            }
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                // 如果要存储在localStorage中
                storage: localStorage,
                key: 'personConfig',
            },
        ],
    },
});
