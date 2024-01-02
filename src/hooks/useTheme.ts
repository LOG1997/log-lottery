import { useStorage } from '@vueuse/core';
import { ref } from 'vue';
export const useTheme = (theme?: string) => {
  const StorageTheme = useStorage('data-theme', theme) || ref('default');
  const setTheme = (theme: string) => {
    StorageTheme.value = theme;
    const body = document.getElementsByTagName('body')[0];
    if (body) {
      body.setAttribute('data-theme', StorageTheme.value);
    }
  };
  if (theme) {
    setTheme(theme);
  } else {
    setTheme(StorageTheme.value as string);
  }

  return { StorageTheme, setTheme };
};
