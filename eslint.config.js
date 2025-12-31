import antfu from '@antfu/eslint-config'

export default antfu(
    {
        ignores: ['**/node_modules', '**/build', '**/.husky', '**/public', '**/dist', '**/package.json', '**/*.yaml', '**/.gitignore', '**/.env*', '**/tsconfig*', '**/*.config.js'],
    },
    {
        rules: {
            'no-console': 'warn',
            'no-debugger': 'warn',
            'style/indent': ['error', 4],
            'indent': ['error', 4, { 'SwitchCase': 1 }],
        }
    },
)