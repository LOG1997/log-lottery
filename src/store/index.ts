import { useGlobalConfig } from './globalConfig'
import { usePersonConfig } from './personConfig'
import { usePrizeConfig } from './prizeConfig'
import { useSystem } from './system'

export default function useStore() {
  return {
    personConfig: usePersonConfig(),
    prizeConfig: usePrizeConfig(),
    globalConfig: useGlobalConfig(),
    system: useSystem(),
  }
}
