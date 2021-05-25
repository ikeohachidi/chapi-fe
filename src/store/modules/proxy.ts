import { ActionContext } from 'vuex';
import Proxy, { ProjectProxy, ProjectProxyQuery, Query } from '@/types/Proxy';
import StoreState from '@/store/storeState';
import Vue from 'vue';

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
    mutations: {
        setProjectProxy(state: ProxyState, project: ProjectProxy): void {
            if (project.projectId in state.projectProxies) {
                state.projectProxies[project.projectId].push(...project.proxies)
            } else {
                Vue.set(state.projectProxies, project.projectId, project.proxies)
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

export default proxy;