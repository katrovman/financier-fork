// Lazy loading of Plaid.js

angular.module("financier").factory("plaidLazyLoader", ($q) => {
    var deferred = $q.defer();
  
    // Load Plaid script
    function loadScript() {
      // Use global document since Angular's $document is weak
      var script = document.createElement("script");
      script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
      script.onload = () => {
        deferred.resolve();
      };
  
      document.body.appendChild(script);
    }
  
    loadScript();
  
    return deferred.promise;
  });
  