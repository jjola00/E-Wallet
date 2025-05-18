/**
 * Handles ticket transferring functionality for the DApp.
 * Connects to MetaMask, validates network, and facilitates ticket transfers.
 */
$(document).ready(function () {
    $("#nav-transfer-ticket").addClass("active");

    // Contract configuration
    const contractAddress = "0x50fc3AfE680CecfBd81c75487f5c80Ebf05eF668";
    const vendorAddress = "0xeC67596e4cF7C1aB5ccFA8C0b20cC34d61129273"; // Vendor address from deployment
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferTickets",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "checkBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    let web3;
    let accounts;
    let contract;

    // Initialize Web3 and MetaMask connection
    if (typeof window.ethereum !== "undefined") {
        web3 = new Web3(window.ethereum);
        window.ethereum.request({ method: "eth_requestAccounts" })
            .then(accs => {
                accounts = accs;
                contract = new web3.eth.Contract(contractABI, contractAddress);
            })
            .catch(err => {
                showStatusMessage("Failed to connect to MetaMask: " + err.message, "danger");
            });
    } else {
        showStatusMessage("Please install MetaMask to use this DApp.", "danger");
        return;
    }

    // Check if the user is on the Sepolia Testnet
    const checkNetwork = async () => {
        const chainId = await web3.eth.getChainId();
        if (chainId !== 11155111) {
            showStatusMessage("Please switch to the Sepolia Testnet in MetaMask.", "danger");
            return false;
        }
        return true;
    };

    // Handle ticket transfer
    $("#transferTicketsButton").click(async function () {
        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) return;

        const recipientAddress = $("#recipientAddress").val().trim();
        const numberOfTickets = $("#numberOfTickets").val();

        if (!recipientAddress) {
            showStatusMessage("Please enter a recipient address.", "danger");
            return;
        }
        if (!web3.utils.isAddress(recipientAddress)) {
            showStatusMessage("Invalid recipient address.", "danger");
            return;
        }
        if (recipientAddress.toLowerCase() !== vendorAddress.toLowerCase()) {
            showStatusMessage("Tickets can only be transferred to the vendor.", "danger");
            return;
        }
        if (!numberOfTickets || numberOfTickets < 1) {
            showStatusMessage("Please enter a valid number of tickets.", "danger");
            return;
        }

        const amount = BigInt(numberOfTickets) * BigInt(10**18); // Correct decimal handling
        const senderAddress = accounts[0];

        showStatusMessage("Checking balance...", "info");
        try {
            const balance = await contract.methods.checkBalance(senderAddress).call();
            const balanceInTickets = web3.utils.fromWei(balance, "ether");
            if (parseFloat(balanceInTickets) < parseFloat(numberOfTickets)) {
                showStatusMessage(`Insufficient balance. You have ${balanceInTickets} TKT, need ${numberOfTickets} TKT.`, "danger");
                return;
            }

            // Estimate gas
            const gasPrice = await web3.eth.getGasPrice();
            const gasEstimate = await contract.methods.transferTickets(recipientAddress, amount).estimateGas({
                from: senderAddress
            });
            const gasCost = BigInt(gasPrice) * BigInt(gasEstimate);

            // Show confirmation modal
            $("#confirmTransferModal .modal-body").html(`
                <p>You are about to transfer ${numberOfTickets} ticket(s) to ${recipientAddress}.</p>
                <p>Estimated gas cost: ${web3.utils.fromWei(gasCost.toString(), "ether")} ETH</p>
                <p>Proceed with the transfer?</p>
            `);
            $("#confirmTransferModal").modal("show");

            // Handle confirmation
            $("#confirmTransferButton").off("click").on("click", async () => {
                $("#confirmTransferModal").modal("hide");
                showStatusMessage("Transferring tickets... Please confirm the transaction in MetaMask.", "info");
                $("#transferTicketsButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Transferring...');

                try {
                    const receipt = await contract.methods.transferTickets(recipientAddress, amount).send({
                        from: senderAddress
                    });
                    showStatusMessage(`Successfully transferred ${numberOfTickets} tickets! Transaction Hash: ${receipt.transactionHash}`, "success");
                } catch (error) {
                    showStatusMessage(`Error transferring tickets: ${error.message}`, "danger");
                } finally {
                    $("#transferTicketsButton").prop("disabled", false).html('<i class="fas fa-exchange-alt me-2"></i>Transfer Tickets');
                }
            });
        } catch (error) {
            showStatusMessage(`Error preparing transfer: ${error.message}`, "danger");
        }
    });

    // Utility function to show status messages
    function showStatusMessage(message, type) {
        $("#statusMessage").html(`
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
    }
});