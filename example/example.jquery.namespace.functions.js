"use strict";

$.customNamespace = function(callbacksConstructor) {
   const NAMESPACE = "customNamespace";
  if (typeof(window[NAMESPACE]) === "undefined") {
    window[NAMESPACE] = {};
  }
  if (typeof(window[NAMESPACE].callbacks) === "undefined") {
    window[NAMESPACE].callbacks = callbacksConstructor;        
  } else if (typeof(window[NAMESPACE].callbacks) === "object") {
    window[NAMESPACE].callbackName = $.extend(window[NAMESPACE].callbackName, 
                                          callbacksConstructor);
  } else {
    window[NAMESPACE].callbackName = callbacksConstructor;
  }
}

$.fn.customNamespace = function (callbackName, params) {
  const NAMESPACE = "customNamespace"; 
  // logger object to handle errors 
  var logger = {};
  logger.missingCallback = function() {
    console.log("%cError: parameter callbackName cannot be empty for $()." + NAMESPACE + "(callbackName)", "color:red");
    return; 
  };
  logger.callbackNotFound = function(callbackName) {
    console.log("%cError: callback function " + callbackName + " not found in $()." + NAMESPACE + "(callbackName)", "color:red");
    return;
  };
  logger.invalidParams = function(callbackName, numParams) {
    var msg = "Error: " + callbackName + " function requires at least " + numParams + " parameter";
    if (numParams > 1) 
      msg += "s";
    console.log("%c" + msg, "color:red");
    return;
  };
  logger.jqueryNotFound = function() {
    console.log("%cError: jquery parameter in $(this).fn not found", "color:red");
    return;
  };

  // validate parameters 
  var isValid = true;
  if (callbackName === undefined) {
    logger.missingCallback(); 
    isValid = false;
  }
  if ($(this).length === 0) {
    logger.jqueryNotFound();
    isValid = false;
  }
  // return early if base parameters invalid
  if (!isValid) {
  	return;
  }
  // initialize params if empty (some functions may not have parameters)
  if (params === undefined)
    params = [];
  // add "this" scope to params so callback functions can manipulate 
  // "this" of parent function 
  params.push($(this));
  // callbacks object for callback functions
  var callbacks = {};
  // if constructor used merge with callbacks object 
  if (typeof(window[NAMESPACE].callbacks) === "object") {
    callbacks = $.extend({}, window.customNamespace.callbacks)
  } 
  // @params[0] = array of objects { display : "" : value: ""} for Select List 
  // @params[1] = string of "display" or "value" to sort on (optional)
  // @params[2] = string type to sort on (string for display. string, float, or 
  //              integer for values) (optional)
  // @return status object of DOM manipulatin 
  callbacks.setListOptions = function(params) {
    if (params.length  < 2) {
      return { msg : "invalid params", numParams: 1};
    }
    // handle overloading the function 
    var arrayList= params[0]; 
    var jquery = params[1];
    if (params.length > 2) {
      var sortOn = params[1];
      jquery = params[2];
    } 
    if (params.length > 3) {
      var sortType = params[2];
      jquery = params[3];
    }
    // validate params 
    if (sortOn === undefined) 
      sortOn = false; 
    if (sortType === undefined)
      sortType = false;
    // sort arrayList according to display / value or sort type  
    if (typeof(sortOn) === "string" && sortOn != false) {
      if (sortOn === "display" && sortType === "string") { 
      arrayList.sort(function(a, b) {
          // set two items to compare case insensitive 
          var nameA = a.display.toUpperCase(); 
          var nameB = b.display.toUpperCase(); 
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
    } else if (sortOn === "values") { // sort by values
      switch (sortType) {
        case "float": 
        arrayList.sort(function(a, b) {
            // set two items to compare
            var nameA = parseFloat(a.value);
            var nameB = parseFloat(b.value);
            if (isNaN(nameA) || isNaN(nameB)) {
              return 0; 
            }
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          });
          break;
      case "integer": 
        arrayList.sort(function(a, b) {
            // set two items to compare
            var nameA = parseInt(a.value, 10);
            var nameB = parseInt(b.value, 10);
            if (isNaN(nameA) || isNaN(nameB))
              return 0; 
            if (nameA < nameB)
              return -1;
            if (nameA > nameB) 
              return 1;
            // names must be equal
            return 0;
        });
        break;
      case "string": 
      default:
          arrayList.sort(function(a, b) {
            // set two items to compare case insensitive 
            var nameA = a.display.toUpperCase(); 
            var nameB = b.display.toUpperCase(); 
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
        });
        break;
      } // end switch sortType
     } // end sortType === "values"
    } // end typeof sortOn
    // build out html for select list input   
    var listHtml = [];
    $(arrayList).each(function(i, listItem) {
      listHtml.push("<option value=\""+ listItem.value + "\">" + listItem.display + "</option>");
    });
    // clear html of select input 
    jquery.html("");
    // bind html to $(this) of jquery function call 
    jquery.append("<option value=\"-1\">Any</option>");        
    jquery.append(listHtml.join(""));
    return { msg : "OK" };
  };
  
  // call callback function and log errors 
  if (callbacks.hasOwnProperty(callbackName)) {
    var status = callbacks[callbackName](params);
    if (typeof (status) === "object" && status.msg === "invalid params") 
      logger.invalidParams(callbackName, status.numParams);
  } else { 
      logger.callbackNotFound(callbackName);
  }
  return;
}; // end $.fn.customNamespace 

$(function() {
  var additionalCallbacks = {};
  // @params[0] = string error message 
  // @return status object of DOM manipulation 
  additionalCallbacks.addError = function(params) {
      if (params.length  != 2) {
        return { msg : "invalid params", numParams: 1};
      }
      // set params
      var errorMsg = params[0];
      var jquery = params[1];
      // add error classes and message
      jquery.find('.error-message').remove();
      jquery.after("<div class=\"error-message text-danger\">" + errorMsg + "</div>");
      jquery.addClass("input-error");
      return { msg : "OK" };
  };
  // initalize namespace with constructor (additional way to add callbacks)
  $.customNamespace(additionalCallbacks);
  // create dom elements for examples
  $("body").append("<select id=\"testList\"></select>");
  $("body").append("<select id=\"testList2\"></select>");

  // example use of setListOptions 
  $("#testList").customNamespace("setListOptions", [
    [ { display: "B word test", value: 2 },
      { display: "Test 1", value: 1.75 }, 
      { display: "Another Test 2", value: 1.50}
    ]
  ]);
  // example overload of setListOptions
  $("#testList2").customNamespace("setListOptions", [
    [ { display: "B word test", value: 2 },
      { display: "Test 1", value: 1.75 }, 
      { display: "Another Test 2", value: 1.50}
    ], "display", "string" // sort by display property alphabeticale
  ]);
  // example use of addError
  $("#testList").customNamespace("addError", [ "Please select an option." ]); // note still use array for one param 
  // example error logging for invalid parameters
  $("#testList").customNamespace("addError");
  $("#testList").customNamespace("unknownCallback");
  $(".invalidSelector").customNamespace();
});