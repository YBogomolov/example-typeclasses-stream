import { Applicative1 } from 'fp-ts/lib/Applicative';
import { Functor1 } from 'fp-ts/lib/Functor';
import { Monad1 } from 'fp-ts/lib/Monad';

import { Task, TaskURI } from './Task';

export const taskFunctor: Functor1<TaskURI> = {
  URI: TaskURI,
  map: <A, B>(taskA: Task<A>, a2b: (a: A) => B): Task<B> => async () => a2b(await taskA()),
};

export const taskApplicative: Applicative1<TaskURI> = {
  ...taskFunctor,
  of: (a) => async () => a,
  ap: <A, B>(taskA2B: Task<(a: A) => B>, taskA: Task<A>): Task<B> => async () => {
    const f = await taskA2B();
    const a = await taskA();
    return f(a);
  },
};

export const taskApplicativePar: Applicative1<TaskURI> = {
  ...taskFunctor,
  of: (a) => async () => a,
  ap: <A, B>(taskA2B: Task<(a: A) => B>, taskA: Task<A>): Task<B> => async () => {
    const [f, a] = await Promise.all([
      taskA2B(),
      taskA(),
    ]);
    return f(a);
  },
};

const join = <A>(tta: Task<Task<A>>): Task<A> => async () => await (await tta())();

export const taskMonad: Monad1<TaskURI> = {
  ...taskApplicative,
  chain: <A, B>(taskA: Task<A>, nextTask: (a: A) => Task<B>): Task<B> =>
    join(taskApplicative.ap(taskApplicative.of(nextTask), taskA)),
};

export const taskMonadPar: Monad1<TaskURI> = {
  ...taskApplicativePar,
  chain: <A, B>(taskA: Task<A>, nextTask: (a: A) => Task<B>): Task<B> =>
    join(taskApplicative.ap(taskApplicative.of(nextTask), taskA)),
};