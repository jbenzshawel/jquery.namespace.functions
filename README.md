# jquery.namespace.functions
jQuery functions / plugin namespace  

Allows calling custom jquery functions (`$.fn.yourFunction`) without interferring with base jquery namespace. Define your namespace by renaming `$.fn.yourNamespace` and setting `const NAMESPACE` in `jquery.namespace.functions.js`. See [example](https://github.com/jbenzshawel/jquery.namespace.functions/blob/master/example/example.jquery.namespace.functions.js) for more examples;

Define callback functions like so:
```javascript
  // example callback function 
  callbacks.yourFunction = function (params) {
  	if (params.length != 2) {
    	return { msg : "invalid params", numParams : 1 }; // second param is default and always set 
   }
   var yourParam = params[0];
   var jquery = params[1];
   // do something with params 
   // example jquery html function call on $(this) of yourNamespace
   jquery.html("<div>" + yourParam + "</div>")
   return { msg : "OK" };
  }
```
Callbacks can either be added directly in `$.fn.yourNamespace` or using the `$.yourNamespace()` constructor. Your namespace can be initialized with additional callback functions like so:
```javascript
  $.yourNamespace(callbacks); 
``` 
Then you can call it later like: 
```javascript
$(".selector").yourNamespace("yourFunction", [ yourParam ]);
```
