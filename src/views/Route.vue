<template>
    <section>
        <config-test-overlay 
            v-if="showConfigResult" 
            :configResult="configTestResult"
            @close="showConfigResult = false"
        />

        <div class="content-padding bg-gray-100 flex items-center py-5">
            <p class="pb-0 font-mono text-sm">
                {{ serverURL }}
            </p>
            <button class="ml-auto" @click="testRouteConfig">Test</button>
        </div>

        <tabs>
            <tab title="Request">
                <request :projectId="projectId" :route="route"/>
            </tab>
            <tab title="Metadata">
                <metadata :route="route"/>
            </tab>
            <tab title="Security">
                <div class="section content-padding">
                    <p>Coming soon 😃</p>
                </div>
            </tab>
            <tab title="Analytics">
                <div class="section content-padding">
                    <p>Coming soon 😃</p>
                </div>
            </tab>
        </tabs>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';
import { Route as VueRoute, NavigationGuardNext } from 'vue-router';

import ConfigTestOverlay from '@/components/ConfigTestOverlay/ConfigTestOverlay.vue';
import { Tab, Tabs } from '@/components/Tabs';
import Metadata from './route-tabs/metadata.vue'
import Request from './route-tabs/request.vue'

import Route from '@/types/Route'
import Project from '@/types/Project';
import { testRoute, projectRoutes } from '@/store/modules/route';
import { getProjectById } from '@/store/modules/project';

@Component({
    components: {
        ConfigTestOverlay,
        Tab, Tabs,
        Metadata,
        Request
    },
    beforeRouteEnter: (to: VueRoute, from: VueRoute, next: NavigationGuardNext) => {
        if (!to.query['project'] || !to.query['route']) {
            next({ path: 'Dashboard' })
        }

        if (from.name !== 'Routes List') {
            next({ name: 'Dashboard' })
        }

        next()
    }
})
export default class RouteView extends Vue {
    private route: Route = new Route;
    private showConfigResult = false;
    private configTestResult = {
        data: '',
        type: false
    }

    get projectId(): number {
        return Number(this.$route.query['project']);
    }

    get routeProject(): Project {
        return getProjectById(this.$store)(this.projectId) as Project;
    }

    get routeId(): number {
        return Number(this.$route.query['route']);
    }

    get siteURL(): string {
        return process.env.VUE_APP_SITE_URL
    }

    get serverURL(): string {
        return `${this.routeProject.name}.${this.siteURL}${this.route.path}` 
    }

    private testRouteConfig() {
        this.showConfigResult = true;

        testRoute(this.$store, this.serverURL)
            .then(response => {
                this.configTestResult = {
                    data: response,
                    type: true
                }
            })
            .catch(error => {
                this.configTestResult = {
                    data: error,
                    type: false 
                }
            })
    }

    mounted(): void {
        const project = projectRoutes(this.$store)

        if (this.projectId in project) {
            const routes = project[this.projectId] as Route[];

            for (const route of routes) {
                if (route.id === this.routeId) {
                    Object.assign(this.route, route);

                    break;
                }
            }
        }
    }
}
</script>