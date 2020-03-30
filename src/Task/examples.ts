import { delay } from 'fp-ts/lib/Task';

import { treeT } from '../Tree/Traversable';
import { Tree } from '../Tree/Tree';

import { taskApplicative, taskApplicativePar, taskFunctor } from './Monad';
import { Task } from './Task';

const tasks: Tree<Task<string>> = {
  tag: 'Branch',
  value: delay(300)(async () => 'Root'),
  forest: [
    {
      tag: 'Leaf',
      value: delay(500)(async () => 'First'),
    },
    {
      tag: 'Leaf',
      value: delay(100)(async () => 'Second'),
    },
  ],
};

const log = (s: string): void => console.log(s);

(async () => {
  await treeT.traverse(taskApplicative)(tasks, t => taskFunctor.map(t, log))();
  console.log('\n');
  await treeT.traverse(taskApplicativePar)(tasks, t => taskFunctor.map(t, log))();
})();

