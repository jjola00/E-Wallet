/**
 * Handles ticket purchasing functionality for the DApp.
 * Connects to MetaMask, validates network, and facilitates ticket purchases.
 */
$(document).ready(function () {
    $("#nav-buy-ticket").addClass("active");

    // Contract configuration
    const contractAddress = "0xNewAddress"; // Replace with your deployed contract address
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "numberOfTickets",
                    "type": "uint256"
                }
            ],
            "name": "buyTickets",
            "outputs": [],
            "stateMutability": "payable",
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
        },
        {
            "inputs": [],
            "name": "TICKET_PRICE",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getTotalSupply",
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
                updateTicketInfo(); // Initial fetch of ticket info
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

    // Update ticket information (price and remaining supply)
    async function updateTicketInfo() {
        try {
            const ticketPrice = await contract.methods.TICKET_PRICE().call();
            const totalSupply = await contract.methods.getTotalSupply().call();
            $("#ticketPrice").text(web3.utils.fromWei(ticketPrice, "ether") + " ETH");
            $("#remainingSupply").text(web3.utils.fromWei(totalSupply, "ether")); // Adjust for 18 decimals
        } catch (error) {
            showStatusMessage("Error fetching ticket info: " + error.message, "danger");
        }
    }

    // Handle ticket purchase
    $("#buyTicketsButton").click(async function () {
        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) return;

        const numberOfTickets = $("#numberOfTickets").val();
        if (!numberOfTickets || numberOfTickets < 1) {
            showStatusMessage("Please enter a valid number of tickets.", "danger");
            return;
        }

        try {
            const ticketPrice = await contract.methods.TICKET_PRICE().call();
            const totalCost = BigInt(numberOfTickets) * BigInt(ticketPrice);

            // Check ETH balance
            const balance = await web3.eth.getBalance(accounts[0]);
            const gasPrice = await web3.eth.getGasPrice();
            const gasEstimate = await contract.methods.buyTickets(numberOfTickets).estimateGas({
                from: accounts[0],
                value: totalCost.toString()
            });
            const gasCost = BigInt(gasPrice) * BigInt(gasEstimate);
            const totalEthNeeded = totalCost + gasCost;

            if (BigInt(balance) < totalEthNeeded) {
                showStatusMessage(
                    `Insufficient ETH. You have ${web3.utils.fromWei(balance, "ether")} ETH, need ${web3.utils.fromWei(totalEthNeeded, "ether")} ETH.`,
                    "danger"
                );
                return;
            }

            // Show confirmation modal
            $("#confirmPurchaseModal .modal-body").html(`
                <p>You are about to buy ${numberOfTickets} ticket(s) for ${web3.utils.fromWei(totalCost.toString(), "ether")} ETH.</p>
                <p>Estimated gas cost: ${web3.utils.fromWei(gasCost.toString(), "ether")} ETH</p>
                <p>Total: ${web3.utils.fromWei(totalEthNeeded.toString(), "ether")} ETH</p>
                <p>Proceed with the purchase?</p>
            `);
            $("#confirmPurchaseModal").modal("show");

            // Handle confirmation
            $("#confirmPurchaseButton").off("click").on("click", async () => {
                $("#confirmPurchaseModal").modal("hide");
                showStatusMessage("Buying tickets... Please confirm the transaction in MetaMask.", "info");
                $("#buyTicketsButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Buying...');

                try {
                    const receipt = await contract.methods.buyTickets(numberOfTickets).send({
                        from: accounts[0],
                        value: totalCost.toString()
                    });

                    const balance = await contract.methods.checkBalance(accounts[0]).call();
                    const balanceInEther = web3.utils.fromWei(balance, "ether");
                    showStatusMessage(
                        `Successfully bought ${numberOfTickets} tickets! Transaction Hash: ${receipt.transactionHash}. Your new balance is ${balanceInEther} TKT.`,
                        "success"
                    );
                    updateTicketInfo();
                } catch (error) {
                    showStatusMessage(`Error buying tickets: ${error.message}`, "danger");
                } finally {
                    $("#buyTicketsButton").prop("disabled", false).html('<i class="fas fa-ticket-alt me-2"></i>Buy Tickets');
                }
            });
        } catch (error) {
            showStatusMessage(`Error preparing purchase: ${error.message}`, "danger");
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