import { ProjectState } from './modules/project';
import { RouteState } from './modules/route';
import { UserState } from './modules/user';

export default interface StoreState {
    project: ProjectState,
    route: RouteState,
    user: UserState
} 