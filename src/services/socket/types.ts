export type paramsType<T> = {
    [Key in keyof T]?: T[Key]
}