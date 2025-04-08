$(document).ready(function() {
    $("#nav-buy-ticket").addClass("active");

    const contractAddress = "0xD5d065CB9FeC8Ce0C6A8A85Bcebfc9209D579e20"; // Update with your deployed contract address
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
        }
        // Add other functions as needed (e.g., checkBalance)
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

    $("#buyTicketsButton").click(async function() {
        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) return;

        const numberOfTickets = $("#numberOfTickets").val();
        if (!numberOfTickets || numberOfTickets < 1) {
            showStatusMessage("Please enter a valid number of tickets.", "danger");
            return;
        }

        showStatusMessage("Buying tickets... Please confirm the transaction in MetaMask.", "info");
        $("#buyTicketsButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Buying...');

        try {
            const ticketPrice = web3.utils.toWei("0.01", "ether"); // 0.01 ETH per ticket
            const totalCost = BigInt(numberOfTickets) * BigInt(ticketPrice);

            await contract.methods.buyTickets(numberOfTickets).send({
                from: accounts[0],
                value: totalCost.toString()
            });

            showStatusMessage(`Successfully bought ${numberOfTickets} tickets!`, "success");
        } catch (error) {
            showStatusMessage(`Error buying tickets: ${error.message}`, "danger");
        } finally {
            $("#buyTicketsButton").prop("disabled", false).html('<i class="fas fa-ticket-alt me-2"></i>Buy Tickets');
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