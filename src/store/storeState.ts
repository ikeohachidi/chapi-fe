import { ProjectState } from './modules/project';
import { ProxyState } from './modules/proxy';

export default interface StoreState {
    project: ProjectState,
    proxy: ProxyState
} 