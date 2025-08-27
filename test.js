import test from 'node:test';
import { strict as assert } from 'node:assert';

import { Signal } from './Signal.js';

test('synchronous passing test', (t) => {

const meow = new Signal('meow!');
const purr = new Signal('purr!');

const impostor = Signal.map(meow, o=>o.toUpperCase().replace(/R/g, 'Я')); // this requires that you .terminate sus, as sus holds subscription to meow.
// impostor.subscribe(v=>console.log('impostor', v))

const katsu = Signal.combineLatest(meow, purr, impostor) // this requires that you .terminate katsu!

// executes 3 times, 1:init, 2:meow=bork, 3:impostor=BOЯK!!
let count = 0;

katsu.subscribe(v=>{
  count++
  // console.log('sus katsu!', v);
  // This test passes because it does not throw an exception.
  if(count == 3) assert.deepEqual(v, [ 'bork!', 'purr!', 'BOЯK!' ]);
})


meow.value = 'bork!';
impostor.terminate();
katsu.terminate();
});


/*

use this pattern to get fancy with it
export class DisposableArrayListener {
  #unsubscribe;
  #previousIds = [];

  constructor(array, event, handler, options = { key: "id" }) {
    this.array = array;
    this.event = event;
    this.handler = handler;
    this.options = options;
    this.isDisposed = false;

    // Add the listener
    this.#unsubscribe = this.array.rev.subscribe(this.#listener.bind(this));
  }

  #listener([rev, uuid]) {
    const metadata = {
      rev,
      uuid,
      change: detectSetChanges( this.#previousIds, this.array.map((o) => o[this.options.key])),
      order: detectOrderChanges( this.#previousIds, this.array.map((o) => o[this.options.key])),
    };
    this.handler(metadata);
    this.#previousIds = this.array.map((o) => o[this.options.key]);
  }

  dispose() {
    if (this.isDisposed) {
      console.warn("Event listener already disposed.");
      return;
    }
    // Remove the event listener
    this.#unsubscribe();
    this.isDisposed = true;
    console.log(`Event listener for ${this.event} disposed.`);
  }
}
*/
