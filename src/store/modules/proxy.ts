import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import Proxy, { ProjectProxy, ProjectProxyQuery } from '@/types/Proxy';
import StoreState from '@/store/storeState';
import Vue from 'vue';
import { Response } from '@/types/HTTP';

type ProxyContext = ActionContext<ProxyState, StoreState>;

const API = process.env.VUE_APP_SERVER;

export type ProxyState = {
    projectProxies: {[projectId: string]: Proxy[]};
}

const state: ProxyState = {
    projectProxies: {} 
}

const proxy = {
    namespaced: true,
    state,
    getters: {
        getProjectProxies(state: ProxyState): {[projectId: string]: Proxy[]} {
            return state.projectProxies
        }
    },
    mutations: {
        setProjectProxy(state: ProxyState, project: ProjectProxy): void {
            if (project.projectId in state.projectProxies) {
                state.projectProxies[project.projectId].push(...project.proxies)
            } else {
                Vue.set(state.projectProxies, project.projectId, project.proxies)
            }
        },
        updateProxy(state: ProxyState, update: Proxy): void {
            const projectProxies =  state.projectProxies[update.projectId];


            for (let i = 0; i < projectProxies.length; i++) {
                if (projectProxies[i].id === update.id) {
                    projectProxies[i] = update;

                    break;
                }
            }
        },
        updateQuery(state: ProxyState, update: ProjectProxyQuery): void {
            const projectProxies =  state.projectProxies[update.projectId];

            for (let i = 0; i < projectProxies.length; i++) {
                if (projectProxies[i].id === update.proxyId) {
                    const queryIndex = projectProxies[i].queries.findIndex(query => query.id === update.query.id);

                    if (queryIndex !== -1) {
                        projectProxies[i].queries[queryIndex] = update.query;
                    }

                    break;
                }
            }
        },
        removeQuery(state: ProxyState, update: ProjectProxyQuery): void {
            const projectProxies =  state.projectProxies[update.projectId];

            for (let i = 0; i < projectProxies.length; i++) {
                if (projectProxies[i].id === update.proxyId) {
                    const queryIndex = projectProxies[i].queries.findIndex(query => query.id === update.query.id);

                    if (queryIndex !== -1) {
                        projectProxies[i].queries.splice(queryIndex, 1)
                    }

                    break;
                }
            }
        }
    },
    actions: {
        createProxy(context: ProxyContext, proxy: Proxy): Promise<void> {
            delete proxy.id;

            return new Promise((resolve, reject) => {
                fetch(`${API}/proxy`, {
                        method: 'POST',
                        body: JSON.stringify(proxy)
                    })
                    .then((res) => res.json())
                    .then((body: Response<string>) => {
                        proxy.id = body.data;
                        
                        if (body.type) {
                            context.commit('setProjectProxy', { 
                                projectId: proxy.projectId,
                                proxies: [proxy]
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
        updateProxy(context: ProxyContext, requestObject: Proxy): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/proxy`, {
                        method: 'PUT',
                        body: JSON.stringify(requestObject)
                    })
                    .then((res) => res.json())
                    .then(() => {
                        context.commit('updateProxy', requestObject)
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        fetchProjectProxies(context: ProxyContext, projectId: string): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/project/${projectId}`)
                    .then((res) => res.json())
                    .then(body => {
                        context.commit('setProjectProxy', { projectId, proxies: body})
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            }) 
        },
        updateQuery(context: ProxyContext, requestObject: ProjectProxyQuery): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/query`, {
                        method: 'PUT',
                        body: JSON.stringify(requestObject.query)
                    })
                    .then((res) => res.json())
                    .then(() => {
                        context.commit('updateQuery', requestObject)
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        deleteQuery(context: ProxyContext, requestObject: ProjectProxyQuery): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/query/${requestObject.query.id}`, {
                        method: 'DELETE',
                    })
                    .then((res) => res.json())
                    .then(() => {
                        context.commit('removeQuery', requestObject)
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        }
    }
}

const { read, dispatch } = getStoreAccessors<ProxyState, StoreState>('proxy');

export const projectProxies = read(proxy.getters.getProjectProxies);

export const createProxy = dispatch(proxy.actions.createProxy);
export const updateProxy = dispatch(proxy.actions.updateProxy);
export const fetchProjectProxies = dispatch(proxy.actions.fetchProjectProxies);
export const updateQuery = dispatch(proxy.actions.updateQuery);
export const deleteQuery = dispatch(proxy.actions.deleteQuery);

export default proxy;