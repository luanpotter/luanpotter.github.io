# A Brief History of Promises
## How Promises came about and evolved in Javascript

Most imperative (non-functional) languages have a tendency to perform all their operations synchronously.
This means that when you call a method, in, say, Java, you expect it a priori to perform your operation on that precise moment, and only return when that's done, with a result.
Even in JS, a simple code like this:

    var result = longOperation(args);

Makes it very clear that the method will hold execution until it's done, so it can return the result string.
While that's good and all, in a more event based language like JS, that has a single thread, it can be dangerous to go around performing a long chain of operations in a single event dispatch.
Therefore, it's very common to see a method like this:

    longOperation(args, function (result) {
        display(result);
    });

This new version of `longOperation`, now written in JS, takes the same `args` as before but also takes a function (making usage of JS incredible powerful functional programing paradigm), that is callback.
A callback is not but a function that is going to be "called back" when the first function ends. The existence of such callback, instead of a return statement, should make it clear the first function is asynchronous, i.e., it returns immediately, and just gives the result later on.
This is a simple distinction that must be made; for instance, take the following two snippets:

    // test A
    longOperation(args, function (result) {
        console.log(result);
    });
    console.log('after');

    // test B
    var result = longOperation(args);
    console.log(result);
    console.log('after');

Note that test B will always give the described result, i.e., it will first print the result and then 'after'. However, one must note that the first (test A) example will always first print 'after' and then prints the result.
This is a simple yet fundamental shift of perspective that would shape the JS development significantly throughout its history. Yet when we try to accomplish something just a little bit more complex, we run into some annoyances.
Let's take a look at the following, more in depth example:

    longOperation1(args, function (result1) {
        longOperation2(result1, function (result2) {
            display(result2);
            triggerScreenChange(function () {
                warnUser(function (response) {
                    sendServerFeedback(response);
                });
            })
        });
    });

As you can see, the code quickly gets a mess as the lines get further and further to the right. This phenomenon shared by every imperative C-like language is labeled callback hell, or more appropriately, Pyramid of Doom (referencing the triangular shape formed by each line start).

How can we make it prettier and easier to understand? Well, let's begin with a simple premise (no pun intended): instead of receiving a callback, the function will return an object that will work as a configurer, that will allow you to setup the callback later on. The API will look like something like this:

    var configurer = longOperation(args);
    configurer.setupCallback(function (response) {
      display(response);
    });

Well, that seems pretty similar. Firstly, let's study how one would be able to go around doing that. Let's assume we have a synchronous `opSync`; we could then create the function `op`:

    var op = function (args) {
      var callback = null;
      var configurer = {
        then : function (aCallback) {
          callback = aCallback;
        }
      };

      setTimeout(function () {
        var result = opSync(arg);
        callback(result);
      }, 0);

      return configurer;
    };

This is a very naïve approach, of course, as it doesn't account for the possibility of the callback not being set upon resolution, for example.
But it clearly shows how easy it is to turn a sync operation into a _configurer_.
Now let's see how we would use the API:

    op1(args).then(function (result1) {
        op2(result1).then(function (result2) {
            op3(result2).then(function (result3) {
                op4(result3).then(function (result4) {
                    sendServerFeedback(result4);
                });
            })
        });
    });

Well... I guess nothing changed, right? Well, that's because we failed to see the greatest advantage of this schema. Our `then` function was `void`, but we can make it return another _configurer_, to attach callbacks after it has ended. Now you can see where this is going... Basically this is making a Builder for the PoD!
The structure would look like this:

    op1(args).then(op2).then(op3).then(op4).then(sendServerFeedback);

That's right, we can do all that with a single like, as long as our functions are _configurer_ compatible. Now that we understood the concept, let's call our _configurer_ by their actual name: promises.
So someone could build this incredible library, that's similar to what we already did, but actually returns subsequent promises and also checks for errors and more? Well, of course they did that. Actually, plenty of people did.

One example is *q*, a very simple JS lib that does that; its syntax would look something like this:

    Q.fcall(promisedStep1).then(promisedStep2).then(promisedStep3).then(promisedStep4).then(function (value4) {
        // Do something with value4
    }).catch(function (error) {
        // Handle any error from all above steps
    }).done();

Taken directly from their docs. Pretty neat, hu?

So for some time people were very happy using several of *q*-like libs, but some libs started depending on these promise libs, and things started to get messy again, as one would need to write a converter to convert between different terminologies.
Eventually a bunch of people got together and made A+, a spec that all promise libs should follow. Then promises would be interchangeable between libs.
You should now go read about that here: https://promisesaplus.com/, and then come back.

After that, this standard got accepted as native in JS, and ECMA 6 finally added the Promise object. It is A+ compatible, native, and made obsolete all promises lib. Now everyone could use that and live happily ever after.
Read this: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise.
Note that this lib also add very interesting methods, like `Promise.all()`, which are of crucial importance for larger apps to remain concise and pretty.

After that, there was more development, and now we have a Stage 3 proposal for the next release to add the `await`/`async` keywords to the language and change promises once again. Check this out: https://ponyfoo.com/articles/understanding-javascript-async-await

That's it!
