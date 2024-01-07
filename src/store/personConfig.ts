import { defineStore } from 'pinia';
import { IPersonConfig } from '@/types/personConfig';
export const usePersonConfig = defineStore('person', {
    state() {
        return {
            personConfig: {
                alreadyPersonList: [] as IPersonConfig[],
                notPersonList: [] as IPersonConfig[],
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
        // 获取已中奖人员名单
        getAlreadyPersonList(state) {
            return state.personConfig.alreadyPersonList;
        },
        // 获取未中奖人员名单
        getNotPersonList(state) {
            return state.personConfig.notPersonList;
        },
        // 获取所有人员名单
        getAllPersonList(state) {
            return state.personConfig.alreadyPersonList.concat(state.personConfig.notPersonList);
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
                this.personConfig.notPersonList.push(item);
            });
        },
        // 添加已中奖人员
        addAlreadyPersonList(personList: IPersonConfig[]) {
            if (personList.length <= 0) {
                return
            }
            personList.forEach((person: IPersonConfig) => {
                this.personConfig.notPersonList = this.personConfig.notPersonList.filter((item: IPersonConfig) =>
                    item.id !== person.id)
                this.personConfig.alreadyPersonList.push(person);
            });
        },
        // 删除指定人员
        deletePerson(person: IPersonConfig) {
            if (person.id != undefined || person.id != null) {
                this.personConfig.alreadyPersonList = this.personConfig.alreadyPersonList.filter((item: IPersonConfig) => item.id !== person.id);
                this.personConfig.notPersonList = this.personConfig.notPersonList.filter((item: IPersonConfig) => item.id !== person.id);
            }
        },
        // 删除所有人员
        deleteAllPerson() {
            this.personConfig.alreadyPersonList = [];
            this.personConfig.notPersonList = [];
        },
        // 设置table列数
        setTableRowCount(tableRowCount: number) {
            this.personConfig.tableRowCount = tableRowCount;
        },
        // 设置要展示那些字段
        setShowFields(showField: any[]) {
            this.personConfig.showField = showField;
        },
        // 重置所有人员
        resetPerson() {
            this.personConfig.alreadyPersonList = [];
            this.personConfig.notPersonList = [];
        },
        // 重置已中奖人员
        resetAlreadyPerson() {
            // 把已中奖人员合并到未中奖人员，要验证是否已存在
            if (this.personConfig.alreadyPersonList.length > 0) {
                this.personConfig.notPersonList = this.personConfig.notPersonList.concat(this.personConfig.alreadyPersonList);
                this.personConfig.alreadyPersonList = [];
            }
        },
        // 重置所有配置
        reset() {
            this.personConfig = {
                alreadyPersonList: [] as IPersonConfig[],
                notPersonList: [] as IPersonConfig[],
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
