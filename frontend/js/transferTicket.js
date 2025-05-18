$(document).ready(function() {
    $("#nav-transfer-ticket").addClass("active");

    let web3;
    let contract;
    let accounts;
    const contractAddress = "0x1fB85B7616804E0AadF7D82f8DdE73EAb41E9309";
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
            "type": "function",
            "payable": true
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
            "type": "function",
            "constant": true
        },
        {
            "inputs": [],
            "name": "getContractBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
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
            "type": "function",
            "constant": true
        },
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
        }
    ];

    async function initializeWeb3() {
        if (typeof window.ethereum === "undefined") {
            showStatusMessage("Please install MetaMask to use this DApp.", "danger");
            return;
        }

        web3 = new Web3(window.ethereum);
        try {
            const requestedAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            if (!requestedAccounts || requestedAccounts.length === 0) {
                throw new Error("No accounts returned. Please allow MetaMask access.");
            }
            accounts = requestedAccounts;
            contract = new web3.eth.Contract(contractABI, contractAddress);
            await checkNetwork();
            await loadVendorAddress(); // Note: No vendor function in this contract
        } catch (error) {
            console.error("MetaMask connection error:", error);
            showStatusMessage(`Failed to connect to MetaMask: ${error.message}`, "danger");
        }
    }

    async function checkNetwork() {
        const chainId = await web3.eth.getChainId();
        const sepoliaChainId = 11155111;
        if (chainId !== sepoliaChainId) {
            showStatusMessage("Please switch to the Sepolia Testnet in MetaMask.", "warning");
        }
    }

    async function loadVendorAddress() {
        try {
            const defaultVendor = accounts[0]; // Fallback to connected account
            $("#vendorAddress").html(`
                <div class="alert alert-info" role="alert">
                    Vendor Address: ${defaultVendor}
                </div>
            `);
            $("#recipientAddress").val(defaultVendor);
        } catch (error) {
            showStatusMessage(`Error fetching vendor address: ${error.message}`, "danger");
        }
    }

    $("#transferTicketButton").click(async function() {
        const recipientAddress = $("#recipientAddress").val().trim();
        const ticketAmount = $("#ticketAmount").val().trim();

        if (!web3.utils.isAddress(recipientAddress)) {
            showStatusMessage("Please enter a valid recipient address.", "danger");
            return;
        }

        if (!ticketAmount || ticketAmount <= 0) {
            showStatusMessage("Please enter a valid number of tickets.", "danger");
            return;
        }

        $("#transferTicketButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Transferring...');

        try {
            if (!accounts) throw new Error("No MetaMask accounts available");
            const amount = ticketAmount;
            await contract.methods.transferTickets(recipientAddress, amount).send({ from: accounts[0] });
            showStatusMessage(`Successfully transferred ${ticketAmount} tickets to ${recipientAddress}!`, "success");
        } catch (error) {
            showStatusMessage(`Error transferring tickets: ${error.message}`, "danger");
            console.error("Transfer error details:", error);
        } finally {
            $("#transferTicketButton").prop("disabled", false).html('<i class="fas fa-exchange-alt me-2"></i>Transfer Tickets');
        }
    });

    function showStatusMessage(message, type) {
        $("#statusMessage").html(`
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
    }

    initializeWeb3();
});