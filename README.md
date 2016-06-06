# jquery.namespace.functions
jQuery functions / plugin namespace  

Allows calling custom jquery functions ($.fn) without interferring with base jquery namespace. Define your namespace renaming $.fn.customNamespace.

Add callback functions like so:
```javascript
  callbacks.yourFunction = function (params) {
  	if (params.length != 2) {
    	return { msg : "invalid params", numParams : 1 }; // second param is default and always set 
   }
   var yourParam = params[0];
   var jquery = params[1];
   // do something with params 
   // example jquery html function call on $(this)
   jquery.html("<div>" + yourParam + "</div>")
   return { msg : "OK" };
    }
   }
```

Then you can call it later like: 
```javascript
$(".selector").yourNamespace("yourFunction", [ yourParam ]);
```
