import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import Proxy, { ProjectProxy, ProjectProxyQuery, Query } from '@/types/Proxy';
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
        addQuery(state: ProxyState, update: ProjectProxyQuery): void {
            const projectProxies =  state.projectProxies[update.projectId];

            const index = projectProxies.findIndex(proxy => proxy.id === update.proxyId);

            if (index === -1) return;

            projectProxies[index].queries.push(update.query);
        },
        updateQuery(state: ProxyState, update: ProjectProxyQuery): void {
            const projectProxies =  state.projectProxies[update.projectId];

            for (let i = 0; i < projectProxies.length; i++) {
                if (projectProxies[i].id === update.proxyId) {
                    const queryIndex = projectProxies[i].queries.findIndex(query => query.id === update.query.id);

                    if (queryIndex !== -1) {
                        projectProxies[i].queries[queryIndex] = update.query;
                    } else {
                        projectProxies[i].queries.push(update.query)
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
                    .then((body: Response<number>) => {
                        proxy.id = body.data;
                        
                        if (body.successful) {
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
                fetch(`${API}/route`, {
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
        fetchProjectProxies(context: ProxyContext, projectId: number): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/route/${projectId}`)
                    .then((res) => res.json())
                    .then((body: Response<Proxy>) => {
                        context.commit('setProjectProxy', { projectId, proxies: body.data})
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            }) 
        },
        testProxy(context: ProxyContext, serverURL: string): Promise<string> {
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
        saveQuery(context: ProxyContext, requestObject: ProjectProxyQuery): Promise<Query> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/query`, {
                        method: 'POST',
                        body: JSON.stringify(requestObject.query)
                    })
                    .then((res) => res.json())
                    .then((body: Response<number>) => {
                        requestObject.query.id = body.data;

                        console.log('body', body);
                        console.log('data', body.data);
                        console.log('requestObject', requestObject);
                        
                        context.commit('addQuery', requestObject)
                        resolve(requestObject.query)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        updateQuery(context: ProxyContext, requestObject: ProjectProxyQuery): Promise<Query> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/query`, {
                        method: 'PUT',
                        body: JSON.stringify(requestObject.query)
                    })
                    .then((res) => res.json())
                    .then((body: Response<number>) => {
                        requestObject.query.id = body.data;
                        
                        context.commit('updateQuery', requestObject)
                        resolve(requestObject.query)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        deleteQuery(context: ProxyContext, requestObject: ProjectProxyQuery): Promise<string> {
            console.log('--', requestObject)

            return new Promise((resolve, reject) => {
                fetch(`${API}/query?id=${requestObject.query.id}&route_id=${requestObject.proxyId}`, {
                        method: 'DELETE',
                    })
                    .then((res) => res.json())
                    .then((body: Response<string>) => {
                        if (body.successful) {
                            context.commit('removeQuery', requestObject)
                        }

                        resolve(body.data)
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

export const saveQuery = dispatch(proxy.actions.saveQuery);
export const updateQuery = dispatch(proxy.actions.updateQuery);
export const deleteQuery = dispatch(proxy.actions.deleteQuery);
export const testProxy = dispatch(proxy.actions.testProxy);

export default proxy;