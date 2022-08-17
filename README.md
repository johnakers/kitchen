# Kitchen

_Kitchen_ is a small, browser based, system that simulates the fulfillment of delivery orders for a kitchen.

It can be viewed at [johnakers.net/kitchen](https://johnakers.net/kitchen)

```
- Two (2) Orders are processed every one (1) second
- Each Order has their own Courier, who arrive between 3 and 15 seconds after being dispatched
- It can be run via MATCHING or FIFO:
--- Courier can pick up a specific Order
--- Courier can pick up the first ready Order
- Click the buttons to show/hide analytics and logs
- All logs can also be viewed in the browser console (e.g. Chrome Dev Tools)
```

### Running locally

To run locally, simply open `./index.html` in your favorite browser. Kitchen was developed in Chrome,
and should work just fine with all modern browsers.

It can be run without an internet connection as the dependencies it has, are included as minified .js
files.

If you would like to change the orders, that can be found in `/js/dispatchOrders.js`.

### How it works

To run either strategy, simply click `RUN MATCHING` or `RUN FIFO`. By default, logs will be in the
dev console on your browser no matter what. They will also appear on the webpage but can be hidden
by clicking `HIDE LOGS` or brought back via `SHOW LOGS`.

The same goes for analytics. They will not be shown until at least one (1) Delivery is made, but after
that, they will be on the bottom left of your webpage, and can be hidden/shown.

### Code structure

```
- Ui, a global object for logging, buttons, text, etc. It is untested, but simply exemplifies Orders being fullfilled
- OrderProcessor, ingests Order data, to the associated Kitchen, dispatches/matches Couriers, creates Deliveries
-- CourierNetwork, is called by the OrderProcessor, to create a Courier, and tracks their whereabouts (idle, intransit, arrived)
-- Kitchen, where Orders are made and tracked into how many orders a Kitchen has
-- Courier, a delivery person
-- Order, a food order
-- Delivery, a picked up order, by a Courier, with an Order (a final product, so to speak)
```

Most of these are "data objects" with only a function or two on them. The OrderProcessor is the "mind" behind it all, more or less.

#### Enumerated state

You'll noticed a common pattern in objects of using state in something like:

```js
class Person {
  constructor(name) {
    this.name = name;
    this.state = 0;
  }

  get states() {
    return {
      0: 'standing',
      1: 'walking',
      2: 'running'
    }
  }

  get currentState() {
    return this.states[this.state];
  }
}
```

This is a pattern I adopted from my time in making little video games. While not leveraged a fair amount
in this exercise, if desired, it is possible to get the text-version of the state, of a current entity.
This works great for sequential states. For instance, an Order will never go from "being prepped" to
"out for delivery" (0 to 2). It *must* pass through the "ready for pickup" state (1). This allows us to do
something like:

```js
let person = new Person('John');

person.state++;
person.currentState; // 'walking'
```

#### Queues

There is also a bit of a pattern of moving objects from one queue to another. While objects have a
state, we can limit some iteration in places, by creating another queue, `.shift()`'ing off an object
when it moves from one queue to another and `.push()`'ing it on to the subsequent queue.

An example of this, would be having a `people` Array, of `Person` objects, using the above code snippet.
When a `Person` goess from one state to another, they go into a `walking` or `running` queue, so we can
easily iterate over all those with that state.

This is exemplified in this project with Couriers, and their, and Orders on whether or not they are in
progress or completed.

### Some interesting parts of code

`OrderProcessor#_updateDeliveries()`

Perhaps the crux of the project. It determines ready Orders for pickup. Depending on the current
strategy mode, assigns Couriers, and then creates the associated Delivery. It is verbosely commented
for this reason.

`CourierNetwork#_getRandomETA()`

One desired trait was to have a uniform distribution of dispatched couriers, between 3 and 15 seconds.
I, admittedly, had to Google hwo to get a uniform distribution, which took me back to my academics. I
was fortunate to stumble across how someone did it on StackOverflow, with a bit of reading into how the
`Math.random` function works in JavaScript. Random numbers are well... random.

`Ui`

While not within the initial scope of the project, I wanted to be able to provide a visual aspect.
Ui is the wrapper around all of that.

### Tests

To see tests run, open `./test.html`. Test code can be viewed under the `./test/` directory. Tests are
written using [Mocha](https://mochajs.org/#running-mocha-in-the-browser), and [Chai](https://www.chaijs.com/).

### Results Observation

The matching algorithm runs a little bit slower, with longer wait times for pickups. An example is,
an Order is ready quickly and sits there while the Courier is delayed, for whatever reason.

Caveat:

I ran this about 10 times on each strategy after finalizing my code. Preferably, a more data-oriented
toolset to use would be best, with thousands of runs and even some sort of Monte Carlo simulation on
varying aspects (variable prep times, variable Courier ETA, even something that effects are Couriers
like a network latency or weather event).

### Why browser based?

Most of my experience is in the [Ruby programming language](https://www.ruby-lang.org/en/), and the
[Rails framework](https://rubyonrails.org/), with a bit of frontend JavaScript along the way (React, Vue, etc.).
I think Ruby is a great language, but it doesn't do concurrency well. There are ways to do it, with
the [parallel gem](https://github.com/grosser/parallel) for instance, but I wanted to do something
that didn't have a fair number of dependencies and could be run on most systems. If you are running
this on Windows machine, there's a good chance you don't have Ruby installed by default.

I have done personal projects in Flash, C#, JavaScript and using a toolset, with a visual component
was something that stood out to me, once given the spec for the project.

I contemplated making this solely a Node application, but the opportunity to use [p5js](https://p5js.org/)
was one that stood out. The trade off is, I lose some access to tooling, packages, and the greater
JavaScript developer ecosystem that you see in Node applications.
An example of this is, while Mocha/Chai allow me to have a test suite, I don't have access to libraries like [sinon](https://sinonjs.org/) for mockking. At least no access to it easily, how I want.

### Why p5?

For little visualizations, games, projects, Processing and its JavaScript equivalent, p5js, is great.
For anybody interested in learning to code, I suggest they look at [Daniel Shiffman's work](https://www.youtube.com/c/TheCodingTrain/videos). The API is straightfoward, well documented, and I have a little
bit of experience with it beforehand (my personal website is in p5, though a very small project).

### Improvements for the future

_Idle couriers_

Once a Courier finishes delivering their Order, after a "rest" time, they should be able to take on
another order, instead of creating a new Courier object. While I thought about that for this exercise, and
remnants of it live in the code, it is currently out-of-scope, but definitely a neat way to optimize
the number of Courier objects created.

_Rewrite it Go_

[Go](https://go.dev/) is a progamming language I've tinkered with a little bit. Its straightfoward, performant
and something I enjoy. For this exercise, my Go skills may not have been where I would like them to be,
but I feel, for the future, it could be a good learning experience. Expect a Go version of Kitchen sometime
in the future.

_Accept variable JSON files_

Either via the command line or a simple form on an HTML page, or even more developed in a tiny JavaScript
app, being able to take in varying JSON files, for testing puroses, would be advantageous.

_A "fancier" visual experience_

Being able to visualize Orders being "ingested", prepped, ready for pickup, picked up, and delivered...
would be something nice to have.

_Storing run information in a .json, .csv, .yml file_

Once things are in a "complete" state, being able to store runs in a downloadable file for the user
would be a neat addition.

### Thanks for taking the time to read all this!
