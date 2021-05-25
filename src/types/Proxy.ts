export default class Proxy {
    id: string;
    name: string;
    url: string;
    chapiURL: string;
    method: string;
    queries: Query[];
    authorizedURLs: AuthorizedURL[];
    projectId: string;

    constructor() {
        this.id = '';
        this.name = '';
        this.url = '';
        this.chapiURL = '';
        this.method = '';
        this.queries = [];
        this.authorizedURLs = [];
        this.projectId = '';
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