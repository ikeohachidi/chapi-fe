import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import Route, { CreateRouteRequest, ProjectRoute, ProjectRouteQuery, Query } from '@/types/Route';
import StoreState from '@/store/storeState';
import Vue from 'vue';
import { Response } from '@/types/HTTP';

type RouteContext = ActionContext<RouteState, StoreState>;

const API = process.env.VUE_APP_SERVER;

export type RouteState = {
    projectRoutes: {[projectId: string]: Route[]};
}

const state: RouteState = {
    projectRoutes: {} 
}

const route = {
    namespaced: true,
    state,
    getters: {
        getProjectRoutes(state: RouteState): {[projectId: string]: Route[]} {
            return state.projectRoutes
        }
    },
    mutations: {
        setProjectRoute(state: RouteState, project: ProjectRoute): void {
            if (project.projectId in state.projectRoutes) {
                state.projectRoutes[project.projectId].push(...project.routes)
            } else {
                Vue.set(state.projectRoutes, project.projectId, project.routes)
            }
        },
        updateRoute(state: RouteState, update: Route): void {
            const projectRoutes =  state.projectRoutes[update.projectId];

            for (let i = 0; i < projectRoutes.length; i++) {
                if (projectRoutes[i].id === update.id) {
                    projectRoutes[i] = update;

                    break;
                }
            }
        },
        addQuery(state: RouteState, update: ProjectRouteQuery): void {
            const projectRoutes =  state.projectRoutes[update.projectId];

            const index = projectRoutes.findIndex(route => route.id === update.routeId);

            if (index === -1) return;

            projectRoutes[index].queries.push(update.query);
        },
        updateQuery(state: RouteState, update: ProjectRouteQuery): void {
            const projectRoutes =  state.projectRoutes[update.projectId];

            for (let i = 0; i < projectRoutes.length; i++) {
                if (projectRoutes[i].id === update.routeId) {
                    const queryIndex = projectRoutes[i].queries.findIndex(query => query.id === update.query.id);

                    if (queryIndex !== -1) {
                        projectRoutes[i].queries[queryIndex] = update.query;
                    } else {
                        projectRoutes[i].queries.push(update.query)
                    }

                    break;
                }
            }
        },
        removeQuery(state: RouteState, update: ProjectRouteQuery): void {
            const projectRoutes =  state.projectRoutes[update.projectId];

            for (let i = 0; i < projectRoutes.length; i++) {
                if (projectRoutes[i].id === update.routeId) {
                    const queryIndex = projectRoutes[i].queries.findIndex(query => query.id === update.query.id);

                    if (queryIndex !== -1) {
                        projectRoutes[i].queries.splice(queryIndex, 1)
                    }

                    break;
                }
            }
        }
    },
    actions: {
        createRoute(context: RouteContext, route: CreateRouteRequest): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/route`, {
                        method: 'POST',
                        body: JSON.stringify(route)
                    })
                    .then((res) => res.json())
                    .then((body: Response<number>) => {
                        if (body.successful) {
                            context.commit('setProjectRoute', { 
                                projectId: route.projectId,
                                routes: [route]
                            })
                            resolve()
                        } else {
                            reject()
                        }
                    })
                    .catch((error) => {
                        reject(error)
                    })
            }) 
        },
        updateRoute(context: RouteContext, requestObject: Route): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/route`, {
                        method: 'PUT',
                        body: JSON.stringify(requestObject)
                    })
                    .then((res) => res.json())
                    .then((body: Response<void>) => {
                        if (body.successful) {
                            context.commit('updateRoute', requestObject)
                        }
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        fetchProjectRoutes(context: RouteContext, projectId: number): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/route/${projectId}`)
                    .then((res) => res.json())
                    .then((body: Response<Route>) => {
                        if (body.successful) {
                            context.commit('setProjectRoute', { projectId, routes: body.data})
                        }
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            }) 
        },
        testRoute(context: RouteContext, serverURL: string): Promise<string> {
            return new Promise((resolve, reject) => {
                let isResponseOk = true;
                fetch(serverURL, {
                    method: 'GET'
                })
                .then(response => {
                    if (!response.ok) {
                        isResponseOk = false;
                    }

                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        return response.text();
                    }
                    return response.json();
                })
                .then(body => {
                    if (isResponseOk) {
                        resolve(body)
                    } else {
                        reject(body)
                    }
                })
                .catch(error => { 
                    reject(error)
                })
            })
        },
    }
}

const { read, dispatch } = getStoreAccessors<RouteState, StoreState>('route');

/**
 * key value pair with projectId as key and array 
 * of routes as value
 */
export const projectRoutes = read(route.getters.getProjectRoutes);

export const createRoute = dispatch(route.actions.createRoute);
export const updateRoute = dispatch(route.actions.updateRoute);
export const fetchProjectRoutes = dispatch(route.actions.fetchProjectRoutes);

export const testRoute = dispatch(route.actions.testRoute);

export default route;