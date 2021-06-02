export default class Proxy {
    id?: string;
    name: string;
    description: string;
    url: string;
    chapiURL: string;
    method: string;
    queries: Query[];
    authorizedURLs: AuthorizedURL[];
    projectId: number;

    constructor() {
        this.id = '';
        this.name = '';
        this.description = '';
        this.url = '';
        this.chapiURL = '';
        this.method = 'GET';
        this.queries = [];
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
    id: string;
    name: string;
    value: string;
    proxyId: string;
}

export type ProjectProxy = {
    projectId: string;
    proxies: Proxy[]
}

export type ProjectProxyQuery = {
    projectId: string;
    proxyId: string;
    query: Query;
}