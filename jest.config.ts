import {createDefaultEsmPreset, type JestConfigWithTsJest} from 'ts-jest'

const presetConfig = createDefaultEsmPreset({})

const jestConfig: JestConfigWithTsJest = {
    ...presetConfig,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    }
}

export default jestConfig