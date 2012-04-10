function doSomething(callback) {
    // Call the callback
    callback('stuff', 'goes', 'here');
}

function foo(a, b, c) {
    // I'm the callback
    console.log(a + " " + b + " " + c);
}

doSomething(foo);

// ----

function doSomething(callback) {
    // Call the callback
    callback('stuff', 'goes', 'here');
}

function foo(a, b, c) {
    // I'm the callback
    console.log(a + " " + b + " " + c);
}

doSomething(foo);

// ------------------------------------ //

GooDataExtractor.extract(key, delimiters, function (importedData) { 
  console.log(importedData);
});