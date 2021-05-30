<template>
    <section>
        <div class="section">
            <div>
                <p class="section-name">Name</p>
                <p class="section-description">
                    Please enter the name of this proxy. This is an important step as your projects proxies can really build up and wil need to be easily identified 
                </p>
            </div>
            <div>
                <input placeholder="Proxy Name" v-model="proxy.name" class="w-full">
            </div>
        </div>
        <div class="section">
            <div>
                <p class="section-name">Description</p>
                <p class="section-description">
                    Sometimes the proxy name isn't enough to help your remember. Your project description will help you identify your proxy faster when going through them in the proxy list page.
                </p>
            </div>
            <div>
                <textarea class="w-full resize-none" rows="6" placeholder="Proxy Description"></textarea>
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
                    <tbody>
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
            </div>
        </div>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

import ProxyClass, { ProjectProxyQuery, Query } from '@/types/Proxy'
import { HTTPMethod } from '@/types/HTTP';

@Component
export default class Proxy extends Vue {
    private proxy: ProxyClass = new ProxyClass;
    private _proxyCheck: ProxyClass = new ProxyClass;

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
        if (this._proxyCheck.id && this.proxy.id) {
            return this._proxyCheck.queries[index].name === this.proxy.queries[index].name &&
                this._proxyCheck.queries[index].value == this.proxy.queries[index].value;
        }

        return false
    } 
    
    private updateQuery(query: Query): void {
        const requestObject: ProjectProxyQuery = {
            projectId: this.projectId,
            proxyId: this.proxyId,
            query
        }

        this.$store.dispatch('proxy/updateQuery', requestObject)
            .catch((error) => {
                console.log(error)
            })
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
                    this.proxy = proxy;
                    this._proxyCheck = JSON.parse(JSON.stringify(proxy));


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
.section div:last-of-type {
    @apply col-span-2;
}

.section-name {
    @apply text-gray-900 font-medium text-base mb-2;
}

.section-description {
    @apply text-gray-600 leading-5 text-sm;
}

.gg-trash {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs,1));
    width: 10px;
    height: 12px;
    border: 2px solid transparent;
    box-shadow:
        0 0 0 2px,
        inset -2px 0 0,
        inset 2px 0 0;
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px;
    margin-top: 4px
}
.gg-trash::after,
.gg-trash::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute
}
.gg-trash::after {
    background: currentColor;
    border-radius: 3px;
    width: 16px;
    height: 2px;
    top: -4px;
    left: -5px
}
.gg-trash::before {
    width: 10px;
    height: 4px;
    border: 2px solid;
    border-bottom: transparent;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    top: -7px;
    left: -2px
}
</style>