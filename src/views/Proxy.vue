<template>
    <section>
        <div class="section">
            <div>
                <p class="section-name">Name</p>
                <p class="section-description">
                    A Good proxy name will help for easy identification later.
                </p>
            </div>
            <div class="flex flex-col">
                <input placeholder="Proxy Name" v-model="proxy.name" class="w-full">
                <button 
                    class="mt-4 ml-auto"
                    :disabled="proxyCheck.name == proxy.name"
                    @click="updateProxy"
                >
                    Save
                </button>
            </div>
        </div>
        <div class="section">
            <div>
                <p class="section-name">Description</p>
                <p class="section-description">
                    It would be best if your description explains what your proxy does clearly. Proxies created can get out of hand. 
                </p>
            </div>
            <div class="flex flex-col">
                <textarea class="w-full resize-none" rows="6" placeholder="Proxy Description" v-model="proxy.description"></textarea>
                <button 
                    class="mt-4 ml-auto"
                    :disabled="proxyCheck.description == proxy.description"
                    @click="updateProxy"
                >
                    Save
                </button>
            </div>
        </div>
        <div class="section">
            <div>
                <p class="section-name">Destination URL</p>
                <p class="section-description">
                    Please enter the URL you'd like to make a request to. Make sure you have the right 
                    <span class="inline-block rounded-sm bg-gray-300 p-1 font-mono">HTTP Method</span> set
                </p>
            </div>
            <div>
                <select v-model="proxy.method" class="rounded-r-none w-2/12">
                    <option v-for="method in HTTPMethodOptions" :key="method" :value="method" class="uppercase">{{ method }}</option>
                </select>
                <input class="rounded-l-none border-l-0 w-10/12" v-model="proxy.url">
            </div>
        </div>
        <div class="section">
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
                    <tbody v-if="proxy.queries">
                        <tr v-for="(query, queryIndex) in proxy.queries" :key="queryIndex">
                            <td class="py-2">
                                <div class="ui input">
                                    <input type="text" v-model="query.name">
                                </div>
                            </td>
                            <td class="px-3">
                                <div class="ui input">
                                    <input type="text" v-model="query.value">
                                </div>
                            </td>
                            <td>
                                <div class="flex items-center justify-center">
                                    <button 
                                        @click="updateQuery(query)"
                                        :disabled="hasQueryChanged(queryIndex)"
                                    >
                                        Update
                                    </button>
                                    <span class="gg-trash text-red-600 cursor-pointer mx-4 hover:scale-50" @click="deleteQuery(query)"></span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button 
                    class="mt-4 ml-auto"
                    @click="addQuery"
                >
                    Add Query
                </button>
            </div>
        </div>
        <div class="section">
            <div>
                <div class="section-name">Request Body</div>
                <div class="section-description">
                    You can add a request body to your proxy. Please note that the body should be in a JSON format.
                </div>
            </div>
            <div>
                <textarea rows="10" class="w-full font-mono resize-none" onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}">
                {}
                </textarea>
                <button 
                    class="mt-4 ml-auto"
                >
                    Save
                </button>
            </div>
        </div>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

import ProxyClass, { ProjectProxyQuery, Query } from '@/types/Proxy'
import { HTTPMethod } from '@/types/HTTP';
import { updateProxy, updateQuery } from '@/store/modules/proxy';

@Component
export default class Proxy extends Vue {
    private proxy: ProxyClass = new ProxyClass;
    private proxyCheck: ProxyClass = new ProxyClass;

    get HTTPMethodOptions(): string[] {
        return Object.keys(HTTPMethod)
    }

    get projectId(): string {
        return this.$route.query['project'] as string;
    }

    get proxyId(): string {
        return this.$route.query['proxy'] as string;
    }

    private hasQueryChanged(index: number): boolean {
        if (this.proxyCheck.id && this.proxy.id) {
            return this.proxyCheck.queries[index].name === this.proxy.queries[index].name &&
                this.proxyCheck.queries[index].value == this.proxy.queries[index].value;
        }

        return false
    }

    private addQuery(): void {
        const newQuery = {
            id: '',
            name: '',
            value: '',
            proxyId: this.proxy.id!
        }
        this.proxyCheck.queries.push({ ...newQuery })
        this.proxy.queries.push({ ...newQuery })
    }

    private updateProxy(): void {
        updateProxy(this.$store, this.proxy)
            .then(() => { this.proxyCheck = this.proxy })
            .catch(error => { console.log(error) })
    }
    
    private updateQuery(query: Query): void {
        const requestObject: ProjectProxyQuery = {
            projectId: this.projectId,
            proxyId: this.proxyId,
            query
        }

        updateQuery(this.$store, requestObject)
            .catch(error => { console.log(error) })
    }

    private deleteQuery(query: Query): void {
        const requestObject: ProjectProxyQuery = {
            projectId: this.projectId,
            proxyId: this.proxyId,
            query
        }

        this.$store.dispatch('proxy/deleteQuery', requestObject)
            .catch((error) => {
                console.log(error)
            })
    }

    mounted(): void {
        const projectsProxies = this.$store.state.proxy.projectProxies;

        if (this.projectId in projectsProxies) {
            const proxies = projectsProxies[this.projectId] as ProxyClass[];

            for (const proxy of proxies) {
                if (proxy.id === this.proxyId) {
                    Object.assign(this.proxy, proxy);
                    this.proxyCheck = JSON.parse(JSON.stringify(proxy));


                    break;
                }
            }
        }
    }
}
</script>

<style lang="postcss" scoped>
.section {
    @apply grid grid-cols-3 gap-5 px-8 py-5 border-b border-gray-200;
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