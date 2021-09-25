export default class Proxy {
    id?: number;
    name: string;
    description: string;
    url: string;
    chapiURL: string;
    method: string;
    path: string;
    queries: Query[];
    body: string;
    authorizedURLs: AuthorizedURL[];
    projectId: number;

    constructor() {
        this.id = 0;
        this.name = '';
        this.description = '';
        this.url = '';
        this.chapiURL = '';
        this.method = 'GET';
        this.path = '';
        this.queries = [];
        this.body = '';
        this.authorizedURLs = [];
        this.projectId = 0;
    }
}

export type CreateProxyRequest = {
    projectId: number;
    path: string;
    description: string;
} 

export type AuthorizedURL = {
    id: string;
    url: string;
    routeId: string;
}

export type Query = {
    id?: number;
    name: string;
    value: string;
    routeId: number;
}

export type ProjectProxy = {
    projectId: string;
    proxies: Proxy[]
}

export type ProjectProxyQuery = {
    projectId: number;
    proxyId: number;
    query: Query;
}