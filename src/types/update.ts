export interface UpdateChildren<T> {
    new?: T[],
    modified?: T[],
    deleted?: T[]
}