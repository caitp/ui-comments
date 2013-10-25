##UI-Comments [![Build Status](https://travis-ci.org/caitp/ui-comments.png?branch=master)](https://travis-ci.org/caitp/ui-comments) [![devDependency Status](https://david-dm.org/caitp/ui-comments/dev-status.png?branch=master)](https://david-dm.org/caitp/ui-comments#info=devDependencies)

###Nested, Reddit-style comments directives for AngularJS

#####[Demo](http://caitp.github.io/ui-comments/) | [Docs](http://caitp.github.io/ui-comments/docs)

Comments are all over the internet these days. It's often not in anyone's best interest to read them, and yet sometimes they offer a certain whimsical charm and hilarity, or otherwise engage you in pop-culture in ways that you'd otherwise miss.

Angular directives can make engineering comment systems very simple, and `$http`, `$resource`, or similar tools can vastly simplify the population of comment data.

The intention of this library is to serve as a simple helper, and perhaps as an example, for a reddit-style comment system, built on two very simple AngularJS directives.

###Development

Building the code is a super-simple exercise:

```bash
$ NODE_ENV=development npm install
$ grunt
```

The above commands will install development dependencies for the library, and run the build and test process (on a single browser, by default).

If desired, it is possible to manually run tests with specific browsers:

- 1) Start the test server:

```bash
$ karma start --browsers PhantomJS [--browsers Chrome [--browsers Firefox]]
```

- 2) After the server and desired browsers are started up, run the tests:

```bash
$ karma run
```

- 3) Alternatively, you can utilize `--single-run` to start the server, execute tests and quit immediately:

```bash
$ karma start [desired --browsers] --single-run
```

Hopefully everything is passing!

Note that it is nice to have a global installation of `karma`, however if this is not available, one can use `./node_modules/grunt-karma/node_modules/karma/bin/karma` instead. That's somewhat more verbose, however!

###Contributing

It would be super cool if this project is actually useful to people, and I know that for what it is currently, there are a lot of things that could be improved on, which I'm not totally sure how to do in a nice way.

- Simpler template customization
- Improved documentation
- Service API for server communication
- More robust testing

So there are lots of things to do, and it would be just awesome if people could help improve them. But, even if people only ever use it as an example for generating nested AngularJS directives, that's fine too. I really just wrote this for fun, but I hope that people can get some use out of it as well.

###License

The MIT License (MIT)

Copyright (c) 2013 Caitlin Potter & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
