import { ActionContext } from 'vuex';
import Project from '@/types/Project';
import StoreState from '@/store/storeState';

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
    mutations: {
        setProjects(state: ProjectState, projects: Project[]): void {
            state.projects = projects;
        },
        addProject(state: ProjectState, project: Project): void {
            state.projects.push(project)
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
        }
    }
}

export default project;