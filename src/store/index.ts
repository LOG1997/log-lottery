import { useUserStore } from './user';

export default function useStore() {
  return {
    user: useUserStore(),
  };
}
