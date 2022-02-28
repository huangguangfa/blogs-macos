import { createPinia } from 'pinia';
import { useSystemStore } from './modules/system';

const pinia = createPinia();

export { useSystemStore };
export default pinia;