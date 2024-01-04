import { useUserStore } from './user';
import {usePersonConfig} from './personConfig';
import { usePrizeConfig } from './prizeConfig';
export default function useStore() {
  return {
    user: useUserStore(),
    personConfig:usePersonConfig(),
    prizeConfig:usePrizeConfig()
  };
}
