"use strict";

// optional constructor to pass callback functions to namespace
$.yourNamespace = function(callbacksConstructor) {
  const NAMESPACE = "yourNamespace";
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

$.fn.yourNamespace = function (callbackName, params) {
  const NAMESPACE = "yourNamespace"; 
  // logger object to handle errors 
  var logger = {};
  logger.missingCallback = function() {
    console.log("%cError: parameter callbackName cannot be empty for $()." + NAMESPACE + "(callbackName)", "color:red");
    return; 
  };
  logger.callbackNotFound = function(callbackName) {
    console.log("%cError: callback function " + callbackName + " not found in $()." + NAMESPACE + "(" + callbackName + ")", "color:red");
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
    callbacks = $.extend({}, window[NAMESPACE].callbacks)
  } 
  /////////////////////////////////////////////////////////
  // ADD CALLBACK FUNCTIONS HERE 
  
  
  // call callback function and log errors 
  if (callbacks.hasOwnProperty(callbackName)) {
    var status = callbacks[callbackName](params);
    if (typeof (status) === "object" && status.msg === "invalid params") 
      logger.invalidParams(callbackName, status.numParams);
  } else { 
      logger.callbackNotFound(callbackName);
  }
  return;
}; // end $.fn.yourNamespace 
