<template>
    <section class="px-5 py-5 grid grid-cols-3 grid-rows-4 gap-5 min-h-full">
        <modal
            title="New Route"
            description="Please fill in a name for the new route"
            actionButtonText="Create Route"
            v-if="showNewRouteModal"
            @close="showNewRouteModal = false"
            @action="createNewRoute"
        >
            <input type="text" placeholder="chapi.com external api's" class="w-full" v-model="path">
            <textarea rows="8" class="mt-5 resize-none w-full" v-model="description" placeholder="Route Description"></textarea>
        </modal>
        <div class="w-full rounded-lg border-dashed border-4 flex items-center justify-center" @click="showNewRouteModal = true">
            <div class="transform scale-150 text-gray-400">
                <i class="ri-add-line"></i>
            </div>
        </div>
        <RouteCard 
            v-for="(route, routeIndex) in projectRoutes"
            :key="routeIndex"
            :route="route"
            @click.native="goToRoute(route)"
        />
    </section>
</template>

<script lang='ts'>
import {Vue, Component, Watch} from 'vue-property-decorator';

import RouteCard from '@/components/RouteCard/RouteCard.vue';
import Modal from '@/components/Modal/Modal.vue';

import Route, { CreateRouteRequest } from '@/types/Route';
import { createRoute, fetchProjectRoutes, projectRoutes } from '@/store/modules/route';

@Component({
    components: {
        RouteCard,
        Modal
    }
})
export default class RouteList extends Vue {
    private path = '';
    private description = '' ;
    private showNewRouteModal = false;

    get projectId(): number {
        return Number(this.$route.query['project']);
    }
    @Watch('projectId')
    onProjectIdChange(): void {
        if (!(this.projectId in projectRoutes(this.$store))) {
            this.getProjectRoutes();
        }
    }

    get projectRoutes(): Route[] {
        const routes = projectRoutes(this.$store);

        if (this.projectId in routes) {
            return routes[this.projectId]
        }

        return []
    }

    private createNewRoute() {
        const route: CreateRouteRequest = {
            projectId: this.projectId,
            path: this.path,
            description: this.description
        }

        createRoute(this.$store, route)
    }

    private goToRoute(route: Route): void {
        this.$router.push({
            name: 'Route' ,
            query: {
                project: String(this.projectId),
                route: route ? String(route.id) : ''
            }
        })
    }

    private getProjectRoutes(): void {
        fetchProjectRoutes(this.$store, this.projectId)
            .catch(error => {
                window.console.log(error)
            })
    }

    mounted(): void {
        if (this.projectRoutes.length === 0) {
            this.getProjectRoutes()
        }
    }
}
</script>