export enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
}

export type Response<T> = {
    successful: boolean;
    data: T;
}

export type TestResponse = {
    headers: Headers | null;
    status: number;
    statusText: string;
    body: string;
}

export type ProxyConfigResult = {
    data: string;
    type: boolean;
    responseTime: number;
}