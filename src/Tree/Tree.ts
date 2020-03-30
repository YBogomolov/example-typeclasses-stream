interface Leaf<A> {
  readonly tag: 'Leaf';
  readonly value: A;
}

interface Branch<A> {
  readonly tag: 'Branch';
  readonly value: A;
  readonly forest: Array<Tree<A>>;
}

export type Tree<A> = Leaf<A> | Branch<A>;

export const TreeURI = 'Tree';
export type TreeURI = typeof TreeURI;

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly Tree: Tree<A>;
  }
}