import { Applicative } from 'fp-ts/lib/Applicative';
import { array } from 'fp-ts/lib/Array';
import { identity } from 'fp-ts/lib/function';
import { HKT } from 'fp-ts/lib/HKT';
import { Monoid } from 'fp-ts/lib/Monoid';
import { Traversable1 } from 'fp-ts/lib/Traversable';

import { treeFunctor } from './Functor';
import { Tree, TreeURI } from './Tree';

export const treeT: Traversable1<TreeURI> = {
  ...treeFunctor,

  reduce: <A, B>(treeA: Tree<A>, b: B, combine: (b: B, a: A) => B): B => {
    switch (treeA.tag) {
      case 'Leaf': return combine(b, treeA.value);
      case 'Branch': return treeA.forest.reduce(
        (acc, subtree) => treeT.reduce(subtree, acc, combine),
        combine(b, treeA.value),
      );
    }
  },

  reduceRight: <A, B>(treeA: Tree<A>, b: B, combine: (a: A, b: B) => B): B => {
    switch (treeA.tag) {
      case 'Leaf': return combine(treeA.value, b);
      case 'Branch': return treeA.forest.reduce(
        (acc, subtree) => treeT.reduceRight(subtree, acc, combine),
        combine(treeA.value, b),
      );
    }
  },

  foldMap: <M>(M: Monoid<M>) => <A>(treeA: Tree<A>, a2M: (a: A) => M): M => treeT.reduce(
    treeA,
    M.empty,
    (acc, a) => M.concat(acc, a2M(a)),
  ),

  traverse: <F>(F: Applicative<F>): (<A, B>(treeA: Tree<A>, f: (a: A) => HKT<F, B>) => HKT<F, Tree<B>>) => {
    const traverseF = array.traverse(F);

    const traverseTree = <A, B>(treeA: Tree<A>, f: (a: A) => HKT<F, B>): HKT<F, Tree<B>> => {
      switch (treeA.tag) {
        case 'Leaf': return F.map(f(treeA.value), (value) => ({ tag: 'Leaf', value }));
        case 'Branch': return F.ap(
          F.map(f(treeA.value), (value: B) => (forest: Array<Tree<B>>) => ({ tag: 'Branch', value, forest })),
          traverseF(treeA.forest, t => traverseTree(t, f)),
        );
      }
    };

    return traverseTree;
  },

  sequence: <F>(F: Applicative<F>): (<A>(ta: Tree<HKT<F, A>>) => HKT<F, Tree<A>>) => {
    const traverseF = treeT.traverse(F);
    return ta => traverseF(ta, identity);
  },
};