import { defineStore } from 'pinia';
import { IUser } from '@/types/user';

export const useUserStore = defineStore('user', {
  state() {
    return {
      userList: [] as IUser[],
    };
  },
  getters: {
    getUserList(state) {
      return state.userList;
    },
  },
  actions: {
    setUserList() {
      const resList: IUser[] = [
        { name: '张三', age: 18 },
        { name: '李四', age: 19 },
      ];
      this.userList = resList;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 如果要存储在localStorage中
        // storage: localStorage,
        paths: ['userList'],
      },
    ],
  },
});
