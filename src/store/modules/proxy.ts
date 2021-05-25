import { ActionContext } from 'vuex';
import Proxy, { ProjectProxy, Query } from '@/types/Proxy';
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
        updateQuery(context: ProxyContext, query: Query): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/query`, {
                        method: 'PUT',
                        body: JSON.stringify(query)
                    })
                    .then((res) => res.json())
                    .then(() => {
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        deleteQuery(context: ProxyContext, query: Query): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/query/${query.id}`, {
                        method: 'DELETE',
                    })
                    .then((res) => res.json())
                    .then(() => {
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