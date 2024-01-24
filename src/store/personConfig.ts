import { defineStore } from 'pinia';
import { IPersonConfig } from '@/types/storeType';
import { IPrizeConfig } from '@/types/storeType';
import { defaultPersonList } from './data'
import { usePrizeConfig } from './prizeConfig';
import dayjs from 'dayjs'
export const usePersonConfig = defineStore('person', {
    state() {
        return {
            personConfig: {
                allPersonList: [] as IPersonConfig[],
                alreadyPersonList: [] as IPersonConfig[],
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
            return state.personConfig.allPersonList.filter((item: IPersonConfig) => {
                return item
            });
        },
        // 获取未获此奖的人员名单
        getNotThisPrizePersonList(state: any) {
            const currentPrize = usePrizeConfig().prizeConfig.currentPrize;
            const data = state.personConfig.allPersonList.filter((item: IPersonConfig) => {
                return !item.prizeId.includes(currentPrize.id as string);
            });

            return data
        },
        // 获取已中奖人员名单
        getAlreadyPersonList(state) {
            return state.personConfig.allPersonList.filter((item: IPersonConfig) => {
                return item.isWin === true;
            });
        },
        // 获取中奖人员详情
        getAlreadyPersonDetail(state) {
            return state.personConfig.alreadyPersonList
        },
        // 获取未中奖人员名单
        getNotPersonList(state) {
            return state.personConfig.allPersonList.filter((item: IPersonConfig) => {
                return item.isWin === false;
            });
        },
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
                    if (item.id === person.id && prize != null) {
                        item.isWin = true
                        // person.isWin = true
                        item.prizeName.push(prize.name)
                        // person.prizeName += prize.name
                        item.prizeTime.push(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
                        // person.prizeTime = new Date().toString()
                        item.prizeId.push(prize.id as string)
                    }

                    return item
                });
                this.personConfig.alreadyPersonList.push(person);
            });
        },
        // 从已中奖移动到未中奖
        moveAlreadyToNot(person: IPersonConfig) {
            if (person.id == undefined || person.id == null) {
                return
            }
            const alreadyPersonListLength = this.personConfig.alreadyPersonList.length
            for (let i = 0; i < this.personConfig.allPersonList.length; i++) {
                if (person.id === this.personConfig.allPersonList[i].id) {
                    this.personConfig.allPersonList[i].isWin = false
                    this.personConfig.allPersonList[i].prizeName = []
                    this.personConfig.allPersonList[i].prizeTime = []
                    this.personConfig.allPersonList[i].prizeId = []

                    break
                }
            }
            for (let i = 0; i < alreadyPersonListLength; i++) {
                this.personConfig.alreadyPersonList = this.personConfig.alreadyPersonList.filter((item: IPersonConfig) =>
                    item.id !== person.id
                )
            }
        },
        // 删除指定人员
        deletePerson(person: IPersonConfig) {
            if (person.id != undefined || person.id != null) {
                this.personConfig.allPersonList = this.personConfig.allPersonList.filter((item: IPersonConfig) => item.id !== person.id);
                this.personConfig.alreadyPersonList = this.personConfig.alreadyPersonList.filter((item: IPersonConfig) => item.id !== person.id);
            }
        },
        // 删除所有人员
        deleteAllPerson() {
            this.personConfig.allPersonList = [];
            this.personConfig.alreadyPersonList = [];
        },

        // 删除所有人员
        resetPerson() {
            this.personConfig.allPersonList = [];
            this.personConfig.alreadyPersonList = [];
        },
        // 重置已中奖人员
        resetAlreadyPerson() {
            // 把已中奖人员合并到未中奖人员，要验证是否已存在
            this.personConfig.allPersonList.forEach((item: IPersonConfig) => {
                item.isWin = false;
                item.prizeName = [];
                item.prizeTime = [];
                item.prizeId = []
            });
            this.personConfig.alreadyPersonList = [];
        },
        setDefaultPersonList() {
            this.personConfig.allPersonList = defaultPersonList;
            this.personConfig.alreadyPersonList = [];
        },
        // 重置所有配置
        reset() {
            this.personConfig = {
                allPersonList: [] as IPersonConfig[],
                alreadyPersonList: [] as IPersonConfig[],
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
