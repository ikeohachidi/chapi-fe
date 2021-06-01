<template>
    <section>
        <modal
            title="New Project"
            description="Please fill in a name for your new project"
            actionButtonText="Create Project"
            v-if="showNewProjectModal"
            @close="showNewProjectModal = false"
            @action="createNewProject"
        >
            <input type="text" placeholder="chapi.com external api's" class="w-full" v-model="newProjectName">
        </modal>

        <div class="px-6 py-8 border-b border-gray-200">
            <input 
                type="text" 
                placeholder="Search Projects" 
                v-model="projectSearch"
                class="w-full"
            >
        </div>

        <div class="px-6 py-4">
            <button class="w-full" @click="showNewProjectModal = true">Create New Project</button>
        </div>

        <ul class="pt-4 px-4">
            <li 
                v-for="project in projects" 
                class="px-4 py-3 flex justify-between items-center"
                :class="{'active': selectedProject.id === project.id}"
                :key="project.id"
                @click="getProjectProxies(project)"
            >
                <span>{{ project.name }}</span>
                <span 
                    class="gg-trash text-gray-200 hover:text-red-500 transition duration-300 cursor-pointer" 
                    @click="deleteProject(project.id)"
                >
                </span>
            </li>
        </ul>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

import Modal from '@/components/Modal/Modal.vue';

import { projects, fetchProjects, createProject, deleteProject } from '@/store/modules/project';

import Project from '@/types/Project';
import Proxy from '@/types/Proxy';

@Component({
    components: {
        Modal
    }
})
export default class ProjectNav extends Vue {
    private newProjectName = '';

    private projectSearch = '';

    private selectedProject: Project = new Project;

    private showNewProjectModal = false;

    get projects(): Project[] {
        return projects(this.$store);
    }

    get projectProxies(): {[projectId: string]: Proxy[]} {
        return this.$store.state.proxy.projectProxies
    }

    private createNewProject() {
        createProject(this.$store, this.newProjectName)
    }

    private deleteProject(projectId: string) {
        deleteProject(this.$store, projectId)
    }

    private getProjectProxies(project: Project) {
        this.selectedProject = project;

        this.$router.push({ 
            name: 'Proxies List',
            query: {
                project: project.id
            }
        })
    }

    mounted(): void {
        if (this.projects.length === 0) {
            fetchProjects(this.$store)
        }
    }
}
</script>

<style lang="postcss" scoped>
.active {
    @apply bg-gray-100 rounded-md;
}
</style>