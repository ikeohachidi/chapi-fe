<template>
    <section>
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
                    <select v-model="routeUpdate.method" class="rounded-r-none w-2/12" style="padding: 8px;" @change="updateRequest">
                        <option v-for="method in HTTPMethodOptions" :key="method" :value="method" class="uppercase">{{ method }}</option>
                    </select>
                    <input class="rounded-l-none border-l-0 w-10/12" v-model="route.destination">
                </div>
                <button 
                    class="mt-4 ml-auto"
                    :disabled="(routeUpdate.destination === route.destination) && (routeUpdate.type === route.type)"
                    @click="updateRequest"
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
                        <tr v-for="(query, queryIndex) in routeUpdate.queries" :key="queryIndex">
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
                        @click="updateRequest"
                        :disabled="routeUpdate.body === route.body"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang='ts'>
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

import Route, { ProjectRouteQuery, Query } from '@/types/Route';
import { HTTPMethod } from '@/types/HTTP';
import { deleteQuery, saveQuery, updateQuery, updateRoute } from '@/store/modules/route';

@Component
export default class Request extends Vue {
    @Prop({ default: new Route }) route!: Route;
    @Prop({ default: 0 }) projectId!: number;

    @Watch('route', { deep: true, immediate: true })
    onRouteChange(value: Route): void {
        Object.assign(this.routeUpdate, { ...value })
    }

    private routeUpdate = new Route;
    // TODO: remove dependence this property
    private newQueries: Query[] = [];

    get HTTPMethodOptions(): string[] {
        return Object.keys(HTTPMethod)
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

    private updateRequest() {
        updateRoute(this.$store, this.route)
            .catch(error => { console.log(error) })
    }

    private hasQueryChanged(index: number): boolean {
        if (this.routeUpdate.id && this.route.id) {
            return this.routeUpdate.queries[index].name === this.route.queries[index].name &&
                this.routeUpdate.queries[index].value == this.route.queries[index].value;
        }

        return false
    }

    private getRequestObject(query: Query): ProjectRouteQuery {
        return {
            projectId: this.projectId,
            routeId: this.route.id!,
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
                this.routeUpdate.queries[queryIndex] = { ...query };
            })
            .catch(error => { console.log(error) })
    }

    private deleteQuery(query: Query): void {
        const requestObject = this.getRequestObject(query)

        deleteQuery(this.$store, requestObject)
    }
}
</script>