export default class Proxy {
    id?: number;
    name: string;
    description: string;
    url: string;
    chapiURL: string;
    method: string;
    queries: Query[];
    requestBody: string;
    authorizedURLs: AuthorizedURL[];
    projectId: number;

    constructor() {
        this.id = 0;
        this.name = '';
        this.description = '';
        this.url = '';
        this.chapiURL = '';
        this.method = 'GET';
        this.queries = [];
        this.requestBody = '';
        this.authorizedURLs = [];
        this.projectId = 0;
    }
}

export type AuthorizedURL = {
    id: string;
    url: string;
    proxyId: string;
}

export type Query = {
    id?: number;
    name: string;
    value: string;
    proxyId: number;
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