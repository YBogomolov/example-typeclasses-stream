import { Functor1 } from 'fp-ts/lib/Functor';

import { Tree, TreeURI } from './Tree';

export const treeFunctor: Functor1<TreeURI> = {
  URI: TreeURI,
  map: <A, B>(treeA: Tree<A>, a2b: (a: A) => B): Tree<B> => {
    switch (treeA.tag) {
      case 'Leaf': return { ...treeA, value: a2b(treeA.value) };
      case 'Branch': return {
        ...treeA,
        value: a2b(treeA.value),
        forest: treeA.forest.map(t => treeFunctor.map(t, a2b)),
      };
    }
  },
};