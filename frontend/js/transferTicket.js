$(document).ready(function() {
    $("#nav-transfer-ticket").addClass("active");

    const contractAddress = "0xD5d065CB9FeC8Ce0C6A8A85Bcebfc9209D579e20";
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
    if (typeof window.ethereum !== "undefined") {
        web3 = new Web3(window.ethereum);
        window.ethereum.request({ method: "eth_requestAccounts" })
            .then(accs => {
                accounts = accs;
            })
            .catch(err => {
                showStatusMessage("Failed to connect to MetaMask: " + err.message, "danger");
            });
    } else {
        showStatusMessage("Please install MetaMask to use this DApp.", "danger");
        return;
    }

    const checkNetwork = async () => {
        const chainId = await web3.eth.getChainId();
        if (chainId !== 11155111) {
            showStatusMessage("Please switch to the Sepolia Testnet in MetaMask.", "danger");
            return false;
        }
        return true;
    };

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    $("#transferTicketsButton").click(async function() {
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
        if (!numberOfTickets || numberOfTickets < 1) {
            showStatusMessage("Please enter a valid number of tickets.", "danger");
            return;
        }

        const amount = web3.utils.toWei(numberOfTickets, "ether");
        const senderAddress = accounts[0];

        showStatusMessage("Checking balance...", "info");
        try {
            const balance = await contract.methods.checkBalance(senderAddress).call();
            const balanceInEther = web3.utils.fromWei(balance, "ether");
            if (parseFloat(balanceInEther) < parseFloat(numberOfTickets)) {
                showStatusMessage(`Insufficient balance. You have ${balanceInEther} TKT, need ${numberOfTickets} TKT.`, "danger");
                return;
            }

            showStatusMessage("Transferring tickets... Please confirm the transaction in MetaMask.", "info");
            $("#transferTicketsButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Transferring...');

            await contract.methods.transferTickets(recipientAddress, amount).send({
                from: senderAddress
            });

            showStatusMessage(`Successfully transferred ${numberOfTickets} tickets to ${recipientAddress}!`, "success");
        } catch (error) {
            showStatusMessage(`Error transferring tickets: ${error.message}`, "danger");
        } finally {
            $("#transferTicketsButton").prop("disabled", false).html('<i class="fas fa-exchange-alt me-2"></i>Transfer Tickets');
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
});