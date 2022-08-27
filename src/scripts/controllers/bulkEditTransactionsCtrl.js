angular
  .module("financier")
  .controller(
    "bulkEditTransactionsCtrl",
    function ($rootScope, $scope, ngDialog) {
      this.removeAll = (transactions, event) => {
        $scope.stopPropagation(event);

        for (let i = 0; i < transactions.length; i++) {
          if (
            transactions[i].transfer &&
            transactions[i].transfer.constructorName === "SplitTransaction"
          ) {
            return ngDialog.open({
              template: require("../../views/modal/noDeleteSplitTransfer.html")
                .default,
              controller: "cancelClickCtrl",
            });
          }
        }

        const reconciled = transactions.reduce((prev, curr) => {
          return prev + (curr.reconciled ? 1 : 0);
        }, 0);

        if (reconciled) {
          const scope = $rootScope.$new({});
          scope.reconciled = reconciled;
          scope.length = transactions.length;
          scope.stopPropagation = $scope.stopPropagation;

          ngDialog
            .openConfirm({
              template:
                require("../../views/modal/removeTransactionsConfirm.html")
                  .default,
              scope,
              className:
                "ngdialog-theme-default ngdialog-theme-default--danger modal",
            })
            .then(remove);
        } else {
          remove();
        }

        function remove() {
          transactions.forEach((transaction) => {
            $scope.manager.removeTransaction(transaction);

            if (transaction.payee) {
              removePayee(transaction);
            }

            transaction.remove();
          });

          $scope.close();
          $rootScope.$broadcast("account:deselectTransactions");
        }
      };

      function removePayee(transaction) {
        const transactions = Object.keys($scope.manager.transactions).map(
          (k) => $scope.manager.transactions[k]
        );

        for (let i = 0; i < transactions.length; i++) {
          if (
            transactions[i].payee === transaction.payee &&
            transactions[i] !== transaction
          ) {
            return;
          }
        }

        if (
          $scope.payees[transaction.payee] &&
          !$scope.payees[transaction.payee].internal
        ) {
          $scope.payees[transaction.payee].remove();
          delete $scope.payees[transaction.payee];
        }
      }

      this.matchTransactions = (transactions, event) => {
        if (transactions.length == 2) {
          console.log(transactions);

          //Need to figure out the proper logic for matching two transactions
          transactions[0].matched_id = transactions[1].id;
          transactions[1].matched_id = transactions[0].id;
        }
      }
    }
  );
