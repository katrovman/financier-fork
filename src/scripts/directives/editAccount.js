import Drop from "tether-drop";

angular
  .module("financier")
  .directive("editAccount", ($compile, $timeout, $rootScope) => {
    return {
      restrict: "A",
      bindToController: {
        editAccount: "=",
        onAccountChange: "&",
        onRemoveAccount: "&",
      },
      controllerAs: "editAccountCtrl",
      controller: function ($scope, $element) {
        $element.on("contextmenu", (e) => {
          e.preventDefault();

          $rootScope.$broadcast("account:deselectTransactions");
          $rootScope.$broadcast("drop:close");

          const template = require("./editAccount.html").default;
          const plaidLinkScript = require("https://cdn.plaid.com/link/v2/stable/link-initialize.js").default;

          const wrap = angular.element("<div></div>").append(template);
          const content = $compile(wrap)($scope);

          content.on("keypress keydown", (e) => {
            if (e.which === 27) {
              dropInstance.close();
            }
          });

          const dropInstance = new Drop({
            target: $element[0],
            content: content[0],
            classes: "drop-theme-arrows-bounce edit-account__positioner",
            position: "left top",
            openOn: "click",
          });

          dropInstance.on("open", () => {
            this.name = this.editAccount.name;
            this.note = this.editAccount.note;
            this.checkNumber = this.editAccount.checkNumber;
            this.linkToken = this.editAccount.linkToken;

            content.find("input")[0].focus();
          });

          dropInstance.on("close", () => {
            $timeout(() => {
              dropInstance.destroy();
            });
          });

          $scope.$on("drop:close", () => {
            dropInstance.close();
          });

          $scope.remove = () => {
            dropInstance.close();
            $scope.onRemove();
          };

          this.submit = () => {
            const saveFn = this.editAccount.fn;
            this.editAccount.fn = null;

            this.editAccount.name = this.name;
            this.editAccount.note = this.note;
            this.editAccount.checkNumber = this.checkNumber;
            this.editAccount.linkToken = this.linkToken;

            this.editAccount.fn = saveFn;
            this.editAccount.emitChange();

            dropInstance.close();
          };

          this.close = () => {
            this.editAccount.closed = true;

            this.onAccountChange();
            dropInstance.close();
          };

          this.open = () => {
            this.editAccount.closed = false;

            this.onAccountChange();
            dropInstance.close();
          };

          this.remove = () => {
            this.onRemoveAccount({ account: this.editAccount });

            dropInstance.close();
          };

          this.plaidLink = () => {
            console.log("Create Plaid Link Token function");

            //TODO: CHANGE URL
            fetch("http://localhost:5006/plaid/make_link_token", { method: "POST" }).then((response) => {
              response.json().then((data) => {
                console.log(data.data);
                this.linkToken = data.data;

                // require.ensure(['https://cdn.plaid.com/link/v2/stable/link-initialize.js'], require => {

                // });

                // const linkHandler = Plaid.create({
                //   token: this.linkToken,
                //   onSuccess: (public_token, metadata) => {
                //     // await fetch("/get_access_token", {
                //     //   method: "POST",
                //     //   body: public_token,
                //     // });
                //   },
                //   onExit: (err, metadata) => {
                //     // if (err != null && err.error_code === "INVALID_LINK_TOKEN") {
                //     //   linkHandler.destroy();
                //     // }
                //     // if (err != null) {
                //     // }
                //   },
                // });
              });
            }).catch((error) => {
              console.log(error);
            });
          };

          dropInstance.open();
        });
      },
    };
  });
