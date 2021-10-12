import { ActionContext } from 'vuex';
import { getStoreAccessors } from "vuex-typescript";
import Header, { HeaderDefault } from '@/types/Header';
import StoreState from '@/store/storeState';
import { Response } from '@/types/HTTP';

type HeaderContext = ActionContext<HeaderState, StoreState>;

const API = process.env.VUE_APP_SERVER;

export type HeaderState = {
    headers: Header[];
}

const state: HeaderState = {
    headers: []
}

const header = {
    namespaced: true,
    state,
    getters: {
        getRouteHeaders(state: HeaderState): (routeId: number) => Header {
            return ((routeId: number) => {
                const index = state.headers.findIndex(header => header.routeId === routeId);

                if (index === -1) return HeaderDefault;

                return state.headers[index]
            })
        }
    },
    mutations: {
        setHeaders(state: HeaderState, headers: Header[]): void {
            state.headers = headers;
        },
        addHeader(state: HeaderState, header: Header): void {
            state.headers.push(header);
        },
        deleteHeader(state: HeaderState, headerId: number): void {
            const index = state.headers.findIndex(header => header.id === headerId);

            if (index !== -1) {
                state.headers.splice(index, 1)
            }
        },
    },
    actions: {
        fetchRouteHeaders(context: HeaderContext, routeId: number): Promise<Header[]> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/header?route=${routeId}`, {
                    credentials: 'include',
                    mode: 'cors'
                })
                .then(response => response.json())
                .then((body: Response<Header[]>) => {
                    context.commit('setHeaders', body.data)
                    resolve(body.data)
                })
                .catch(error => reject(error))
            })
        },
        saveHeader(context: HeaderContext, header: Header): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/header?route=${header.routeId}`, { 
                        method: 'POST',
                        credentials: 'include'
                    })
                    .then((res) => res.json())
                    .then((body: Response<string>) => {
                        context.commit('addHeader', {
                            id: body.data,
                            ...header,
                        })
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        deleteHeader(context: HeaderContext, header: Header): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/header?route=${header.routeId}&name=${header.name}`, {
                        method: 'DELETE'
                    })
                    .then((res) => res.json())
                    .then(() => {
                        context.commit('deleteHeader', header.id)
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
    }
}

const { read, dispatch } = getStoreAccessors<HeaderState, StoreState>('header');

const {actions, getters} = header 

export const getRouteHeaders = read(getters.getRouteHeaders);

export const fetchRouteHeaders = dispatch(actions.fetchRouteHeaders);
export const saveHeader = dispatch(actions.saveHeader);
export const deleteHeader = dispatch(actions.deleteHeader);

export default header;