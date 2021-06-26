import { ProjectState } from './modules/project';
import { ProxyState } from './modules/proxy';
import { UserState } from './modules/user';

export default interface StoreState {
    project: ProjectState,
    proxy: ProxyState,
    user: UserState
} 