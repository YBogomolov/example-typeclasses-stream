import { treeFunctor } from './Functor';
import { Tree } from './Tree';

const toString = (tree: Tree<number>): Tree<string> => treeFunctor.map(tree, n => n.toString());

const aTree: Tree<number> = {
  tag: 'Branch',
  value: 42,
  forest: [
    {
      tag: 'Leaf',
      value: 14,
    },
    {
      tag: 'Leaf',
      value: 21,
    },
  ],
};

console.dir(toString(aTree), { depth: null });
console.dir(treeFunctor.map(aTree, n => n + 1), { depth: null });