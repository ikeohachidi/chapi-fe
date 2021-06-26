import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import StoreState from '@/store/storeState';
import { Response } from '@/types/HTTP';
import User from '@/types/User';

const API = process.env.VUE_APP_SERVER;

export type UserContext = ActionContext<UserState, StoreState>

export type UserState = {
    user: User | null
}

const state: UserState = {
    user: null 
}

const userStore = {
    namespaced: true,
    state,
    mutations: {
        setUser(state: UserState, user: User) {
            state.user = user;
        }
    },
    actions: {
        fetchAuthUser(context: UserContext): Promise<User> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/user/auth`, {
                    credentials: 'include',
                    mode: 'cors'
                })
                .then(response => response.json())
                .then((body: Response<User>) => {
                    context.commit('setUser', body.data) 
                    resolve(body.data)
                })
                .catch(error => {
                    reject(error)
                })
            })
        }
    }
}

const { dispatch } = getStoreAccessors<UserState, StoreState>('user');
const { actions } = userStore;

export const fetchAuthUser = dispatch(actions.fetchAuthUser);

export default userStore;