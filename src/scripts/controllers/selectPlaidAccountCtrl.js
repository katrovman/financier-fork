angular
    .module("financier")
    .controller("selectPlaidAccountCtrl", function($scope, public_token, metadata) {
        this.metadata = metadata;
        this.public_token = public_token;

        this.selectedAccount = "";

        this.submit = () => {
            this.loading = true;
            $scope.closeThisDialog(this.selectedAccount);
            this.loading = false;
        };
    });