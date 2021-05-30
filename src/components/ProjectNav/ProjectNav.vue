<template>
    <section>
        <div class="px-6 py-8 border-b border-gray-200">
            <input 
                type="text" 
                placeholder="Search Projects" 
                v-model="projectSearch"
                class="w-full"
            >
        </div>

        <ul class="pt-4 px-4">
            <li 
                v-for="project in projects" 
                class="px-4 py-3"
                :class="{'active': selectedProject.id === project.id}"
                :key="project.id"
                @click="getProjectProxies(project)"
            >
                {{ project.name }}
            </li>
        </ul>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

import Project from '@/types/Project';
import Proxy from '@/types/Proxy';

@Component
export default class ProjectNav extends Vue {
    private projectSearch = '';

    private selectedProject: Project = new Project;

    get projects(): Project[] {
        return this.$store.state.project.projects
    }

    get projectProxies(): {[projectId: string]: Proxy[]} {
        return this.$store.state.proxy.projectProxies
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
            this.$store.dispatch('project/fetchProjects')
        }
    }
}
</script>

<style lang="postcss" scoped>
.active {
    @apply bg-gray-100 rounded-md;
}
</style>