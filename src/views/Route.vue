<template>
    <section>
        <config-test-overlay 
            v-if="showConfigResult" 
            :configResult="configTestResult"
            @close="showConfigResult = false"
        />
        <template>
            <div class="content-padding bg-gray-100 flex items-center py-5">
                <p class="pb-0 font-mono text-sm">
                    {{ serverURL }}
                </p>
                <button class="ml-auto" @click="testRouteConfig">Test</button>
            </div>
            <div class="section content-padding">
                <div>
                    <p class="section-name">Destination URL</p>
                    <p class="section-description">
                        Please enter the URL you'd like to make a request to. Make sure you have the right 
                        <span class="inline-block rounded-sm bg-gray-300 p-1 font-mono">HTTP Method</span> set
                    </p>
                </div>
                <div class="flex flex-col">
                    <div>
                        <select v-model="route.method" class="rounded-r-none w-2/12" style="padding: 8px;" @change="updateRoute">
                            <option v-for="method in HTTPMethodOptions" :key="method" :value="method" class="uppercase">{{ method }}</option>
                        </select>
                        <input class="rounded-l-none border-l-0 w-10/12" v-model="route.destination">
                    </div>
                    <button 
                        class="mt-4 ml-auto"
                        :disabled="(routeCheck.destination === route.destination) && (routeCheck.type === route.type)"
                        @click="updateRoute"
                    >
                        Save
                    </button>
                </div>
            </div>
            <div class="section content-padding">
                <div>
                    <div class="section-name">URL Queries</div>
                    <div class="section-description">
                        Enter the queries that will be placed on request the URL during the request 
                    </div>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr class="text-left text-gray-800">
                                <th class="py-2 pl-3 font-normal">Name</th>
                                <th class="px-3 font-normal">Value</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-if="route.queries">
                            <tr v-for="(query, queryIndex) in route.queries" :key="queryIndex">
                                <td class="py-2 w-2/5">
                                    <div class="ui input">
                                        <input type="text" v-model="query.name">
                                    </div>
                                </td>
                                <td class="px-3 w-2/5">
                                    <div class="ui input">
                                        <input type="text" v-model="query.value">
                                    </div>
                                </td>
                                <td class="w-1/5">
                                    <div class="flex items-center justify-center">
                                        <button 
                                            @click="updateQuery(query, queryIndex)"
                                            :disabled="hasQueryChanged(queryIndex)"
                                        >
                                            Update
                                        </button>
                                        <span class="text-red-600 cursor-pointer mx-4 hover:scale-50" @click="deleteQuery(query)">
                                            <i class="ri-close-fill"></i>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="(query, queryIndex) in newQueries" :key="`query-${queryIndex}`">
                                <td class="py-2 w-2/5">
                                    <div class="ui input">
                                        <input type="text" v-model="query.name">
                                    </div>
                                </td>
                                <td class="px-3 w-2/5">
                                    <div class="ui input">
                                        <input type="text" v-model="query.value">
                                    </div>
                                </td>
                                <td class="w-1/5">
                                    <div class="flex items-center justify-center">
                                        <button 
                                            @click="saveQuery(query, queryIndex)"
                                        >
                                            Save 
                                        </button>
                                        <span class="text-red-600 cursor-pointer mx-4 hover:scale-50" @click="newQueries.splice(queryIndex, 1)">
                                            <i class="ri-close-fill"></i>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="mt-4 ml-auto" @click="addQuery">Add Query</button>
                </div>
            </div>
            <div class="section content-padding">
                <div>
                    <div class="section-name">Request Body</div>
                    <div class="section-description">
                        You can add a request body to your route. Please note that the body should be in a JSON format.
                    </div>
                </div>
                <div>
                    <textarea 
                        rows="10" 
                        class="w-full font-mono resize-none" 
                        onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}"
                        placeholder="{}"
                        v-model="route.body"
                    >
                    </textarea>
                    <div class="flex">
                        <button 
                            class="mt-4 ml-auto" 
                            @click="updateRoute"
                            :disabled="routeCheck.body === route.body"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
            <div class="section content-padding">
                <div>
                    <p class="section-name">Description</p>
                    <p class="section-description">
                        It would be best if your description explains what your route does clearly. Proxies created can get out of hand. 
                    </p>
                </div>
                <div class="flex flex-col">
                    <textarea class="w-full resize-none" rows="6" placeholder="Route Description" v-model="route.description"></textarea>
                    <button 
                        class="mt-4 ml-auto"
                        :disabled="routeCheck.description == route.description"
                        @click="updateRoute"
                    >
                        Save
                    </button>
                </div>
            </div>
        </template>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';
import { Route as VueRoute, NavigationGuardNext } from 'vue-router';

import ConfigTestOverlay from '@/components/ConfigTestOverlay/ConfigTestOverlay.vue';

import Route, { ProjectRouteQuery, Query } from '@/types/Route'
import { HTTPMethod } from '@/types/HTTP';
import Project from '@/types/Project';
import { deleteQuery, saveQuery, testRoute, updateRoute, updateQuery, projectRoutes } from '@/store/modules/route';
import { getProjectById } from '@/store/modules/project';

@Component({
    components: {
        ConfigTestOverlay
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
    private routeCheck: Route = new Route;
    private showConfigResult = false;
    private configTestResult = {
        data: '',
        type: false
    }

    private newQueries: Query[] = [];

    get HTTPMethodOptions(): string[] {
        return Object.keys(HTTPMethod)
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

    private hasQueryChanged(index: number): boolean {
        if (this.routeCheck.id && this.route.id) {
            return this.routeCheck.queries[index].name === this.route.queries[index].name &&
                this.routeCheck.queries[index].value == this.route.queries[index].value;
        }

        return false
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

    private addQuery(): void {
        const newQuery: Query = {
            id: 0,
            name: '',
            value: '',
            routeId: this.route.id as number
        }
        this.newQueries.push(newQuery);
    }

    private updateRoute(): void {
        updateRoute(this.$store, this.route)
            .then(() => {
                Object.assign(this.routeCheck, this.route)
            })
            .catch(error => { console.log(error) })
    }

    private getRequestObject(query: Query): ProjectRouteQuery {
        return {
            projectId: this.projectId,
            routeId: this.routeId,
            query
        }
    }

    private saveQuery(query: Query) {
        const requestObject = this.getRequestObject(query)

        saveQuery(this.$store, requestObject)
            .then(() => {
                this.newQueries = [];
            })
    }
    
    private updateQuery(query: Query, queryIndex: number): void {
        const requestObject = this.getRequestObject(query)

        if (!requestObject.query.id) {
            delete requestObject.query.id
        }

        updateQuery(this.$store, requestObject)
            .then((query: Query) => {
                this.routeCheck.queries[queryIndex] = { ...query };
            })
            .catch(error => { console.log(error) })
    }

    private deleteQuery(query: Query): void {
        const requestObject = this.getRequestObject(query)

        deleteQuery(this.$store, requestObject)
    }

    mounted(): void {
        const project = projectRoutes(this.$store)

        if (this.projectId in project) {
            const routes = project[this.projectId] as Route[];

            for (const route of routes) {
                if (route.id === this.routeId) {
                    Object.assign(this.route, route);
                    this.routeCheck = JSON.parse(JSON.stringify(route));


                    break;
                }
            }
        }
    }
}
</script>

<style lang="postcss" scoped>
.content-padding {
    @apply px-16 md:px-36;
}

.section {
    @apply grid grid-cols-3 gap-5 py-5 border-b border-gray-200;
}

.section:last-of-type {
    @apply border-b-0 !important;
}

.section div:last-of-type {
    @apply col-span-2;
}

.section-name {
    @apply text-gray-900 font-medium text-base mb-2;
}

.section-description {
    @apply text-gray-600 leading-5 text-sm;
}
</style>