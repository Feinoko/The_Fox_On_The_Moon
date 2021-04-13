// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"dgxz":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"HLm6":[function(require,module,exports) {

},{"./..\\..\\media\\language-flags\\britainFlag.svg":[["britainFlag.1a967940.svg","P02J"],"P02J"],"./..\\..\\media\\language-flags\\frenchFlag.svg":[["frenchFlag.0b354e95.svg","izvn"],"izvn"],"./..\\..\\media\\banners\\banner-hero-darker2.svg":[["banner-hero-darker2.cb2a217d.svg","ZBjp"],"ZBjp"],"./..\\..\\media\\banners\\index-cosmetic-spacer.png":[["index-cosmetic-spacer.cb1b5936.png","ZOFL"],"ZOFL"]}],"sGFj":[function(require,module,exports) {
/* =========================
 NEW-IN CAROUSEL INTERACTIONS
 ===========================  */

/* ========
Table of Contents:
1.  Desktop navigation
2.  Mobile navigation
3.  Resets
============ */

/* =====
Desktop navigation
====== */
var slider_EL = document.querySelector('.new-in__slider');
var rightArrow_EL = document.querySelector('.new-in__right');
var leftArrow_EL = document.querySelector('.new-in__left');
var panels_EL = document.querySelectorAll('.new-in__panels');
var howManyPanels = panels_EL.length; // keep record of number of clicks on right or left arrow, to determine limit after which event not triggered, due to user having reached end

var counter = 0;
var canSlideRight = true; // turns to false as user reached end of carousel, grays out arrow & disable event

var canSlideLeft = false; // by default carousel is at left end (origin) so user cannot slide left
// set default greyed out left arrow

leftArrow_EL.style.color = 'rgb(170, 170, 170)';

slider_EL.onclick = function (e) {
  panels_EL.forEach(function (panel) {
    // get 'position' custom inline css var
    var panelPositionProperty = window.getComputedStyle(panel);
    var position = Number(panelPositionProperty.getPropertyValue('--position')); // update 'position' custom inline css var on each panel (for next click):
    // -100% if click right arrow

    if (e.target.classList.contains('new-in__right')) {
      if (canSlideRight) {
        // allow event handler unless user has reached end of carousel
        canSlideLeft = true; // enables sliding left next time

        leftArrow_EL.style.color = '#173336'; // left arrow becomes clickable again

        position -= 50;
        panel.setAttribute('style', "--position:".concat(position));
      } // +100% if click left arrow

    } else if (e.target.classList.contains('new-in__left')) {
      if (canSlideLeft) {
        // allow event handler unless user has reached end of carousel
        canSlideRight = true; // enables sliding left next time

        rightArrow_EL.style.color = '#173336'; // right arrow becomes clickable again

        position += 50;
        console.log('position value: ' + position);
        panel.setAttribute('style', "--position:".concat(position));
      }
    } // perform the translation


    var newPositionTranslate = "translateX(".concat(position, "%)");
    console.log(position);
    panel.style.transform = newPositionTranslate;
  }); // end foreach
  // check if user has reached end panel:
  // if reached right limit

  if (e.target.classList.contains('new-in__right')) {
    counter++;
    console.log("counter: ".concat(counter));

    if (counter >= howManyPanels - 1) {
      counter = howManyPanels - 1;
      canSlideRight = false;
      console.log("canSlideright set to false");
      rightArrow_EL.style.color = 'rgb(170, 170, 170)';
    }
  } // if reached left limit


  if (e.target.classList.contains('new-in__left')) {
    counter--;
    console.log("counter: ".concat(counter));

    if (counter <= 0) {
      counter = 0;
      canSlideLeft = false;
      console.log("canSlideleft set to false");
      leftArrow_EL.style.color = 'rgb(170, 170, 170)';
    }
  }
};
/* ==========
 Mobile navigation 
 ========= */

/* concept: play on opacity, the parent panel always has opacity = 1, and the others by default 0. As the user clicks arrows, children panels get opacity from 0 to 1, in turn, using an array */
// variables:
// arrow cursors


var mobRightArrow_EL = document.querySelector('.new-in__mob-slider-right');
var mobLeftArrow_EL = document.querySelector('.new-in__mob-slider-left'); // the parent element

var parent_EL = document.querySelector('.new-in__title'); // the panels

var panels = document.querySelectorAll('.new-in__card-container .new-in__panels');
var numberOfPanels = panels.length;
console.log("no. of panels: ".concat(numberOfPanels)); // opacity controller for children panels, is an array with all indexes set to 0 opacity by default

var opacityController = Array.from(Array(numberOfPanels)); // for maintainability, when changing collections maybe there will be 5 panels this time if Max is very creative ;), it needs to adapt
// setting default 0 values

for (var i = 0; i < opacityController.length; i++) {
  opacityController[i] = 0;
}

console.log("this is the array containing the opacity values 'opacityController', equal to ".concat(opacityController)); // keep record of number of clicks on right or left arrow, to determine limit after which event not triggered, due to user having reached end

counter = 0;
canSlideRight = true; // turns to false as user reached end of carousel, grays out arrow & disable event

canSlideLeft = false; // by default carousel is at left end (origin) so user cannot slide left
// set default greyed out left arrow

mobLeftArrow_EL.style.color = 'rgb(170, 170, 170)'; // event handler

parent.onclick = function (e) {
  var indexOfTargetPanel = -1; // sliding to right

  if (e.target === mobRightArrow_EL) {
    // allow event handler unless user has reached end of carousel
    if (canSlideRight) {
      canSlideLeft = true; // enables sliding left next time
      // finding the index that is equal to 1 (if any, by default there is none as all children panels are 0 opacity)...

      opacityController.forEach(function (opacity, index) {
        if (opacity === 1) {
          indexOfTargetPanel = index;
          console.log("panel no. ".concat(indexOfTargetPanel + 1, " is currently visible"));
        }
      }); // if all indexes = 0, set the 1st panel to 1...

      if (indexOfTargetPanel === -1) {
        opacityController[0] = 1;
        console.log("opacityController: ".concat(opacityController)); // else, set the next index to 1
      } else {
        opacityController[indexOfTargetPanel + 1] = 1;
        console.log("opacityController: ".concat(opacityController));
      } // ...then assigning the opacity to the elements (initial i=1 to exclude the parent who always has 1 opacity)


      for (var _i = 1; _i < panels_EL.length; _i++) {
        panels_EL[_i].style.opacity = "".concat(opacityController[_i - 1]);
        console.log("panel no. ".concat(_i + 1, " has opacity = ").concat(opacityController[_i - 1]));
      }

      mobLeftArrow_EL.style.color = '#173336'; // left arrow becomes clickable again
      // check if user has reached end panel

      counter++;
      console.log("counter: ".concat(counter));

      if (counter === numberOfPanels) {
        canSlideRight = false;
        console.log("canSlideRight set to false");
        mobRightArrow_EL.style.color = 'rgb(170, 170, 170)';
      }
    }
  } // sliding to left


  if (e.target === mobLeftArrow_EL) {
    if (canSlideLeft) {
      canSlideRight = true; // enables sliding right next time;
      // finding the index that is equal to 0 if any

      opacityController.forEach(function (opacity, index) {
        if (opacity === 0) {
          indexOfTargetPanel = index;
          console.log("panel no. ".concat(indexOfTargetPanel + 1, " is currently invisible"));
        }
      }); // if all indexes = 1, set the last panel to 0...

      if (indexOfTargetPanel === -1) {
        opacityController[opacityController.length - 1] = 0;
        console.log("opacityController: ".concat(opacityController)); // else, set the previous index to 0
      } else {
        opacityController[indexOfTargetPanel - 1] = 0;
        console.log("opacityController: ".concat(opacityController));
      } // ...then assigning the opacity to the elements (initial i=1 to exclude the parent who always has 1 opacity)


      for (var _i2 = 1; _i2 < panels_EL.length; _i2++) {
        panels_EL[_i2].style.opacity = "".concat(opacityController[_i2 - 1]);
        console.log("panel no. ".concat(_i2 + 1, " has opacity = ").concat(opacityController[_i2 - 1]));
      }

      mobRightArrow_EL.style.color = '#173336'; // right arrow becomes clickable again
      // check if user has reached end panel

      counter--;
      console.log("counter: ".concat(counter));

      if (counter === 0) {
        canSlideLeft = false;
        console.log("canSlideLeft set to false");
        mobLeftArrow_EL.style.color = 'rgb(170, 170, 170)';
      }
    }
  }
};
/* ====================
 resets when switching from desktop/mobile version 
 ====================== */
// variables


var mediaQuery = window.matchMedia('(max-width: 500px)');
var wasMobile; // below value-resets occur only if viewport was in mobile mode 1st (reverting from mobile)
// listen for window resize

window.addEventListener('resize', propertyResetter); // media query, trigger when screen below 500px

function propertyResetter() {
  // resets translates, resets carousel position to origin by resetting opacity (1st panel has 1, others have 0)
  if (mediaQuery.matches) {
    console.log('hello');
    panels_EL.forEach(function (panel) {
      panel.style.transform = 'translateX(0)';
      panel.style.opacity = '0';
      wasMobile = true;
    });
    panels_EL[0].style.opacity = '1'; // counter keeps tracks of whether user has reached end of carousels (to grey out arrow and prevent further sliding)

    counter = 0;
  } // reset translateX inline css & custom var --translate to initial value in case user enlarges screen again above 500px (otherwise messes up slider system panels)


  if (wasMobile && !mediaQuery.matches) {
    console.log('reverted to wide / panel mode');
    var translateInitialValue = 0;
    var position = 0;
    panels_EL.forEach(function (panel) {
      panel.style.transform = "translateX(".concat(translateInitialValue, "%)");
      translateInitialValue += 100;
      panel.setAttribute('style', "--position:".concat(position));
      position += 100; // some panels have been set to 0 opacity if user had used slider on mob viewport, so they must all be visible if reverting to desktop mode

      panel.style.opacity = '1'; // counter that keeps tracks of whether user has reached end of carousels (to grey out arrow and prevent further sliding)

      counter = 0;
    });
  }
}
},{}],"dYQb":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

require("../css/styles.scss");

require("./newInCarousel");

// required when using async/await with parcel
// styles entry point

/** MOBILE NAVI **/

/* mobile main menu */
var overlay_EL = document.querySelector('.site-header__mobile-overlay');
var burger_EL = document.querySelector('.site-header__burger');
burger_EL.addEventListener('click', function () {
  // make mobile menu invisible after it is closed...
  if (overlay_EL.offsetWidth != 0) {
    overlay_EL.style.opacity = '0'; // ... or visible if opening
  } else {
    overlay_EL.style.opacity = '1';
  } // slides in


  overlay_EL.classList.toggle('site-header__mobile-overlay--transition'); // burger morph infographics

  burger_EL.classList.toggle('site-header__burger--transition'); // remove also the submenu, if it is active

  if (sub_overlay_EL.offsetWidth != 0) {
    sub_overlay_EL.classList.remove('site-header__mobile-overlay--transition');
    sub_overlay_EL.style.opacity = '0';
  }
});
/* mobile sub menu */

var sub_overlay_EL = document.querySelector('.site-header nav:nth-child(2)'); // get shop (trigger)

var shop_EL = document.querySelector('#shop');
shop_EL.addEventListener('click', function (e) {
  // make mobile sub menu visible 
  sub_overlay_EL.style.opacity = '1'; // slides in

  sub_overlay_EL.classList.add('site-header__mobile-overlay--transition'); // retract
  // get return arrow

  var returnArrow_EL = document.querySelector('.sub-menu-return'); // retract sub nav when click the arrow

  returnArrow_EL.addEventListener('click', function () {
    sub_overlay_EL.classList.remove('site-header__mobile-overlay--transition');
    sub_overlay_EL.style.opacity = '0';
  });
});
/* pick random hero colors // optionnal */

var root_EL = document.querySelector(':root'); // window.onload = randoBgColors();

function randoBgColors() {
  root_EL.style.setProperty('--colorHeaderBg1', randomColor());
  root_EL.style.setProperty('--colorHeaderBg2', randomColor());
  root_EL.style.setProperty('--colorHeaderBg3', randomColor());
  root_EL.style.setProperty('--colorHeaderBg4', randomColor());
}

function randomColor() {
  var colorPalette = ['#014d57', '#068596', '#7c1785', '#1963ed'];
  var index = Math.floor(Math.random() * colorPalette.length);
  console.log('index of colorPalette returned: ' + index);
  return colorPalette[index];
}
},{"regenerator-runtime/runtime":"dgxz","../css/styles.scss":"HLm6","./newInCarousel":"sGFj"}]},{},["dYQb"], null)
//# sourceMappingURL=js.415763c8.js.map