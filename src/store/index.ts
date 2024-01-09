import {usePersonConfig} from './personConfig';
import { usePrizeConfig } from './prizeConfig';
import {useGlobalConfig} from './globalConfig';
export default function useStore() {
  return {
    personConfig:usePersonConfig(),
    prizeConfig:usePrizeConfig(),
    globalConfig:useGlobalConfig()
  };
}
