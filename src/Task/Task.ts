export const TaskURI = 'Task';
export type TaskURI = typeof TaskURI;

export type Task<A> = () => Promise<A>;

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly Task: Task<A>;
  }
}