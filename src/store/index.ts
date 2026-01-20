import { useGlobalConfig } from './globalConfig'
import { usePersonConfig } from './personConfig'
import { usePrizeConfig } from './prizeConfig'
import { useServerConfig } from './serverConfig'
import { useSourceConfig } from './sourceConfig'
import { useSystem } from './system'

export default function useStore() {
    return {
        personConfig: usePersonConfig(),
        prizeConfig: usePrizeConfig(),
        globalConfig: useGlobalConfig(),
        system: useSystem(),
        serverConfig: useServerConfig(),
        sourceConfig: useSourceConfig(),
    }
}
