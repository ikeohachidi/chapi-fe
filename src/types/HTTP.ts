export enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
}

export type Response<T> = {
    text: string;
    type: boolean;
    data: T;
}

export type ProxyConfigResult = {
    data: string;
    type: boolean;
}