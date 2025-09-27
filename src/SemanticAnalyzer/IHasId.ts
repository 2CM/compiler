export interface IHasId {
    id: string;

    createId(parentId: string): void
}