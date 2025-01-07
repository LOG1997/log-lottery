import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['**/node_modules', '**/public', '**/dist', '**/package.json', '**/*.yaml', '**/.gitignore', '**/.env*', '**/tsconfig*'],
  },
)
