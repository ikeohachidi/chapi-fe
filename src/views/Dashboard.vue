<template>
    <section class="dashboard">
        <div class="left-pane">
            <div class="p-4">
                <h5 class="fw-bold">Projects</h5>
                <div class="ui input">
                    <input type="text" placeholder="Search Project" v-model="projectSearch">
                </div>
            </div>

            <ul>
                <li 
                    v-for="project in projects" 
                    class="px-4"
                    :class="{'active': selectedProject.id === project.id}"
                    :key="project.id"
                    @click="getProjectProxies(project)"
                >
                    {{ project.name }}
                </li>
            </ul>
        </div>
        <div class="right-pane" style="overflow-y: auto;">
            <router-view/>
        </div>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';


import Project from '@/types/Project';
import Proxy from '@/types/Proxy';

@Component
export default class Dashboard extends Vue {
    private projectSearch = '';

    private selectedProject: Project = new Project;

    get projects(): Project[] {
        return this.$store.state.project.projects
    }

    get projectProxies(): {[projectId: string]: Proxy[]} {
        return this.$store.state.proxy.projectProxies
    }

    private getProjectProxies(project: Project) {
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

<style lang="scss" scoped>
.dashboard {
    height: calc(100vh - 41px);
    display: flex;
}

.active {
    background-color: rgba(0, 153, 255, 0.233);
}

.left-pane {
    width: 25%;
    max-width: 350px;
    border-right: 1px solid var(--border-color);

    ul {
        list-style-type: none;
        padding-left: 0;

        li {
            padding: 10px;
        }
    }
}

.right-pane {
    width: 75%;
    // background-color: #dbeafe;
    padding: 30px 0;
}
</style>