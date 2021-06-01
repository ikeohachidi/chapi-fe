import { ActionContext } from 'vuex';
import { getStoreAccessors } from "vuex-typescript";
import Project from '@/types/Project';
import StoreState from '@/store/storeState';
import { Response } from '@/types/HTTP';

type ProjectContext = ActionContext<ProjectState, StoreState>;

const API = process.env.VUE_APP_SERVER;

export type ProjectState = {
    projects: Project[];
}

const state: ProjectState = {
    projects: []
}

const project = {
    namespaced: true,
    state,
    getters: {
        getProjects(state: ProjectState): Project[] {
            return state.projects;
        }
    },
    mutations: {
        setProjects(state: ProjectState, projects: Project[]): void {
            state.projects = projects;
        },
        addProject(state: ProjectState, project: Project): void {
            state.projects.push(project)
        },
        deleteProject(state: ProjectState, projectId: string): void {
            const index = state.projects.findIndex(project => project.id === projectId);

            if (index !== -1) {
                state.projects.splice(index, 1)
            }
        },
        removeProject(state: ProjectState, deleteProject: Project): void {
            const projectIndex = state.projects.findIndex(project => project.id === deleteProject.id);

            if (projectIndex !== -1) {
                state.projects.splice(projectIndex, 1)
            }
        }
    },
    actions: {
        fetchProjects(context: ProjectContext): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/project`)
                    .then((res) => res.json())
                    .then(body => {
                        context.commit('setProjects', body)
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            }) 
        },
        createProject(context: ProjectContext, projectName: string): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/project`, { 
                        method: 'POST',
                        body: JSON.stringify({
                            name: projectName
                        })
                    })
                    .then((res) => res.json())
                    .then((body: Response<string>) => {
                        context.commit('addProject', {
                            name: projectName,
                            id: body.data 
                        })
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        deleteProject(context: ProjectContext, projectId: string): Promise<void> {
            return new Promise((resolve, reject) => {
                fetch(`${API}/project/${projectId}`, {
                        method: 'DELETE'
                    })
                    .then((res) => res.json())
                    .then(() => {
                        context.commit('deleteProject', projectId)
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
    }
}

const { read, dispatch } = getStoreAccessors<ProjectState, StoreState>('project');

export const projects = read(project.getters.getProjects);
export const fetchProjects = dispatch(project.actions.fetchProjects);
export const createProject = dispatch(project.actions.createProject);
export const deleteProject = dispatch(project.actions.deleteProject);

export default project;