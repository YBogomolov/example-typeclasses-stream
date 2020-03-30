import * as Arr from 'fp-ts/lib/Array';
import * as Ord from 'fp-ts/lib/Ord';

class User {
  constructor(readonly name: string, readonly age: number) {}
}

const users: User[] = [
  new User('Yuriy', 31),
  new User('Oleg', 28),
  new User('Egor', 14),
];

const ordUser: Ord.Ord<User> = Ord.contramap<number, User>(u => u.age)(Ord.ordNumber);

const sortedByAge = Arr.sort(ordUser)(users);

console.dir(sortedByAge, { depth: null });