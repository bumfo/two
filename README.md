# two
Two-way binding language construct for JavaScript. 

## Introduction
New language constructs called “Cell” and “Relation” are introduced to support two-way binding at language level. 

### Cell
A Cell is fundamentally a wrapper of a value, with a `set` method for setting its value, and a `value` field for reading its value. A Cell can be associated with several listeners which are called whenever `set` method is called. 

Circular dependencies between listeners are automatically resolved, and it’s the user’s responsibility to maintain consistency. Say, the side effects of the listeners during the entire propagation of each event should be independent from how circular dependencies are resolved. 

### Relation
Like computed properties in most frameworks, *two* has a similar construct. Given two Cells A and B, a Relation is basically a description about how B’s value is calculated from A’s value. Once Relations are declared, the states of Cells participated in the Relations are maintained gracefully and automatically.

Relations are maintained by `addRelation(A, f, B)` method, where `A` and `B` are as mentioned above, and `f` is a mapping from the value of `A` to the value of `B`.

## Example
In the example below we declared two Cells A and B, and a Relation from A to B which simply multiplies the value of A by 3. The value of B can be observed by reading its `value` field, and it’s 9 (= 3 * 3) in this example once the value of A is set to 3. 
```
var A = new Cell();
var B = new Cell();

addRelation(A, x => x * 3, B);

A.set(3);
B.value; // 9
```
