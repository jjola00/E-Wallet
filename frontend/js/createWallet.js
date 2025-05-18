$(document).ready(function() {
    $("#nav-create-wallet").addClass("active");

    let web3;
    if (typeof window.ethereum !== "undefined") {
        web3 = new Web3(window.ethereum);
    } else {
        showStatusMessage("Please install MetaMask to use this DApp.", "danger");
        return;
    }

    $("#createWalletButton").click(function() {
        const password = $("#password").val().trim();
        if (!password) {
            showStatusMessage("Please enter a password.", "danger");
            return;
        }

        $("#createWalletButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Creating...');

        try {
            const wallet = web3.eth.accounts.create();
            // Create an unencrypted JSON object with wallet details
            const walletData = {
                address: wallet.address,
                privateKey: wallet.privateKey
            };

            const walletDetails = `
                <div class="alert alert-success" role="alert">
                    <h4 class="alert-heading">Wallet Created Successfully!</h4>
                    <p><strong>Address:</strong> ${wallet.address}</p>
                    <p><strong>Private Key:</strong> ${wallet.privateKey}</p>
                    <p><strong>Wallet Data:</strong></p>
                    <pre>${JSON.stringify(walletData, null, 2)}</pre>
                    <button id="downloadWalletData" class="btn btn-secondary mt-2">Download Wallet Data</button>
                </div>
            `;
            $("#walletDetails").html(walletDetails);

            $("#downloadWalletData").click(function() {
                const blob = new Blob([JSON.stringify(walletData)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `wallet-${wallet.address}.json`;
                a.click();
                URL.revokeObjectURL(url);
            });

            showStatusMessage("Wallet created successfully!", "success");
        } catch (error) {
            showStatusMessage(`Error creating wallet: ${error.message}`, "danger");
        } finally {
            $("#createWalletButton").prop("disabled", false).html('<i class="fas fa-wallet me-2"></i>Create Wallet');
        }
    });

    $("#importWalletButton").click(function() {
        const walletFile = $("#keystoreFile")[0].files[0];

        if (!walletFile) {
            showStatusMessage("Please upload a wallet file.", "danger");
            return;
        }

        $("#importWalletButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Importing...');

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const walletData = JSON.parse(event.target.result);
                
                // Validate the JSON structure
                if (!walletData.address || !walletData.privateKey) {
                    throw new Error("Invalid wallet file: Missing address or private key.");
                }

                // Verify the private key by creating a wallet instance
                const wallet = web3.eth.accounts.privateKeyToAccount(walletData.privateKey);

                // Ensure the address matches
                if (wallet.address.toLowerCase() !== walletData.address.toLowerCase()) {
                    throw new Error("Invalid wallet file: Address does not match private key.");
                }

                const walletDetails = `
                    <div class="alert alert-success" role="alert">
                        <h4 class="alert-heading">Wallet Imported Successfully!</h4>
                        <p><strong>Address:</strong> ${wallet.address}</p>
                        <p><strong>Private Key:</strong> ${wallet.privateKey}</p>
                    </div>
                `;
                $("#walletDetails").html(walletDetails);

                showStatusMessage("Wallet imported successfully!", "success");
            } catch (error) {
                showStatusMessage(`Error importing wallet: ${error.message}`, "danger");
            } finally {
                $("#importWalletButton").prop("disabled", false).html('<i class="fas fa-file-import me-2"></i>Import Wallet');
            }
        };
        reader.onerror = function() {
            showStatusMessage("Error reading the wallet file.", "danger");
            $("#importWalletButton").prop("disabled", false).html('<i class="fas fa-file-import me-2"></i>Import Wallet');
        };
        reader.readAsText(walletFile);
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