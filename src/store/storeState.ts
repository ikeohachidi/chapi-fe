import { ProjectState } from './modules/project';
import { RouteState } from './modules/route';
import { UserState } from './modules/user';
import { HeaderState } from './modules/header';
import { QueryState } from './modules/query';

export default interface StoreState {
    project: ProjectState,
    route: RouteState,
    user: UserState,
    query: QueryState,
    header: HeaderState
} 