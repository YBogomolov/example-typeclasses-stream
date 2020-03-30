import * as Arr from 'fp-ts/lib/Array';
import { Eq, eqNumber, eqString, getStructEq } from 'fp-ts/lib/Eq';

interface User {
  readonly name: string;
  readonly age: number;
}

const eqUser: Eq<User> = {
  equals: (u1, u2) => u1.name === u2.name,
};

const users: User[] = [
  { name: 'Yuriy', age: 31 },
  { name: 'Oleg', age: 28 },
  { name: 'Egor', age: 14 },
];

const yuriy: User = { name: 'Yuriy', age: 30 };

const isPresent = Arr.elem(eqUser)(yuriy, users);
console.log(isPresent);