/**
 * Handles balance checking functionality for the DApp.
 * Connects to MetaMask, validates network, and displays ticket and ETH balances for different actors.
 */
$(document).ready(function () {
    $("#nav-check-balance").addClass("active");

    // Contract configuration
    const contractAddress = "0x50fc3AfE680CecfBd81c75487f5c80Ebf05eF668";
    const contractABI = [
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
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "scanTicket",
            "outputs": [],
            "stateMutability": "nonpayable",
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
                $("#walletAddress").val(accs[0]);
                contract = new web3.eth.Contract(contractABI, contractAddress);
                updateBalances("attendee"); // Default to attendee mode
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

    // Update balances based on actor mode
    async function updateBalances(mode) {
        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) return;

        const walletAddress = $("#walletAddress").val().trim();
        if (!walletAddress || !web3.utils.isAddress(walletAddress)) {
            showStatusMessage("Please enter a valid wallet address.", "danger");
            return;
        }

        $("#checkBalanceButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Checking...');
        try {
            let ticketBalance = "N/A", ethBalance = "N/A";
            if (mode === "attendee" || mode === "doorman") {
                ticketBalance = web3.utils.fromWei(await contract.methods.checkBalance(walletAddress).call(), "ether");
            }
            if (mode === "attendee" || mode === "venue") {
                ethBalance = web3.utils.fromWei(await web3.eth.getBalance(walletAddress), "ether");
            }

            let display = "";
            if (mode === "attendee") {
                display = `
                    <div class="alert alert-success" role="alert">
                        Ticket Balance: ${ticketBalance} TKT<br>ETH Balance: ${ethBalance} ETH
                    </div>
                `;
            } else if (mode === "doorman") {
                display = `
                    <div class="alert alert-success" role="alert">
                        Ticket Balance: ${ticketBalance} TKT (for scanning)
                    </div>
                `;
            } else if (mode === "venue") {
                display = `
                    <div class="alert alert-success" role="alert">
                        ETH Balance: ${ethBalance} ETH
                    </div>
                `;
            }
            $("#balanceResult").html(display);
            showStatusMessage("Balances updated successfully!", "success");
        } catch (error) {
            showStatusMessage(`Error checking balances: ${error.message}`, "danger");
        } finally {
            $("#checkBalanceButton").prop("disabled", false).html('<i class="fas fa-search me-2"></i>Check Balance');
        }
    }

    // Handle balance check
    $("#checkBalanceButton").click(() => updateBalances($("#actorMode").val()));

    // Handle refresh button
    $("#refreshButton").click(() => updateBalances($("#actorMode").val()));

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