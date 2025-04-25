$(document).ready(function() {
    $("#nav-create-wallet").addClass("active");

    function resetWalletDetails() {
        $("#walletDetails").hide();
        $("#walletAddress").val("");
        $("#privateKey").val("");
        $("#keystore").val("");
    }

    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function() {
        $("#password").val("");
        $("#importPrivateKey").val("");
        $("#importPassword").val("");
        $("#statusMessage").empty();
        resetWalletDetails();
    });

    $("#createWalletButton").click(function() {
        const password = $("#password").val();
        if (!password) {
            showStatusMessage("Please enter a password for the keystore.", "danger");
            return;
        }

        showStatusMessage("Creating wallet... Please wait.", "info");
        $("#createWalletButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Creating...');

        try {
            const web3 = new Web3();
            const wallet = web3.eth.accounts.create();

            $("#walletAddress").val(wallet.address);
            $("#privateKey").val(wallet.privateKey);

            const keystore = web3.eth.accounts.encrypt(wallet.privateKey, password);
            $("#keystore").val(JSON.stringify(keystore, null, 2));

            $("#walletDetails").show();
            showStatusMessage("Wallet created successfully!", "success");
        } catch (error) {
            showStatusMessage(`Error creating wallet: ${error.message}`, "danger");
        } finally {
            $("#createWalletButton").prop("disabled", false).html('<i class="fas fa-wallet me-2"></i>Create Wallet');
        }
    });

    $("#importWalletButton").click(function() {
        const privateKey = $("#importPrivateKey").val().trim();
        const password = $("#importPassword").val();

        if (!privateKey) {
            showStatusMessage("Please enter a private key.", "danger");
            return;
        }
        if (!password) {
            showStatusMessage("Please enter a password for the new keystore.", "danger");
            return;
        }

        showStatusMessage("Importing wallet... Please wait.", "info");
        $("#importWalletButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Importing...');

        try {
            const web3 = new Web3();
            if (!privateKey.startsWith("0x")) {
                throw new Error("Private key must start with '0x'.");
            }
            const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);

            $("#walletAddress").val(wallet.address);
            $("#privateKey").val(wallet.privateKey);

            const keystore = web3.eth.accounts.encrypt(wallet.privateKey, password);
            $("#keystore").val(JSON.stringify(keystore, null, 2));

            $("#walletDetails").show();
            showStatusMessage("Wallet imported successfully!", "success");
        } catch (error) {
            showStatusMessage(`Error importing wallet: ${error.message}`, "danger");
        } finally {
            $("#importWalletButton").prop("disabled", false).html('<i class="fas fa-file-import me-2"></i>Import Wallet');
        }
    });

    $("#downloadKeystore").click(function() {
        const keystore = $("#keystore").val();
        if (!keystore) {
            showStatusMessage("Please create or import a wallet first.", "danger");
            return;
        }
        const walletAddress = $("#walletAddress").val();
        const blob = new Blob([keystore], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${walletAddress}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showStatusMessage("Keystore downloaded successfully!", "success");
    });

    function showStatusMessage(message, type) {
        $("#statusMessage").html(`
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
    }
});