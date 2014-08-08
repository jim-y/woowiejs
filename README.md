Woowie
======

#### :recycle: Woowie is under development. First stable version not released yet.

  Lightweight JavaScript library for beginner web developers. Woowie have a jQuery like syntax, but it is 
  much more smaller. Actually, what i used almost always in jQuery was just a small subset of the original API.
  Then, i came down with the idea to make a small library which is small, easy to use, and contains features what a
  beginner should/would use.

#### Features

  * DOM traversing
  * AJAX api
  * Built in AJAX mocks
  * AJAX as Promises
  * .. and more **TBC**

## Installation

```bash
$ wget https://raw.githubusercontent.com/jim-y/woowiejs/master/dist/bundle.woowie.min.js
```

## Basic Usage 

```js
// jQuery like syntax for accessing DOM elements
var _tasks = w('.task');

[].forEach.call(_tasks, function(task) {

  task.addEventListener('click', function(event) {
    // ajax returns a Promise object
    var promise = w.ajax({
      url: 'backend/get',
      type: 'GET',
      contentType: "text/html"
    });

    promise.onFulfill(function(result) {
      // onfulfill
    });

    promise.onReject(function(err) {
      // onrejection
    });
  });

});
```

## Philosophy

**Woowie** was made to make learning web-development easier. jQuery like libraries need to shim browser differencies, because their API will be used in production environment. Also, they are featureful, and these libraries contains many parts that a single web developer doesn't need. 

I am a `Junior Software Engineer` who likes to make home projects for the web. I love JavaScript, and therefore i wanted to make something new ( at least, for myself :) ). **Woowie** wants to give you a simple API with many useful features. Like ajax mocks, which will be useful when you are in develeopment phase on your project, etc. More TBC.

## Licence
[MIT](LICENCE)