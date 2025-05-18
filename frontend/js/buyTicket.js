$(document).ready(function() {
    $("#nav-buy-ticket").addClass("active");

    const contractAddress = "0xD5d065CB9FeC8Ce0C6A8A85Bcebfc9209D579e20";
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

    $("#buyTicketsButton").click(async function() {
        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) return;

        const numberOfTickets = $("#numberOfTickets").val();
        if (!numberOfTickets || numberOfTickets < 1) {
            showStatusMessage("Please enter a valid number of tickets.", "danger");
            return;
        }

        showStatusMessage("Fetching ticket price...", "info");
        try {
            const ticketPrice = await contract.methods.TICKET_PRICE().call();
            const totalCost = BigInt(numberOfTickets) * BigInt(ticketPrice);

            showStatusMessage("Buying tickets... Please confirm the transaction in MetaMask.", "info");
            $("#buyTicketsButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Buying...');

            await contract.methods.buyTickets(numberOfTickets).send({
                from: accounts[0],
                value: totalCost.toString()
            });

            const balance = await contract.methods.checkBalance(accounts[0]).call();
            const balanceInEther = web3.utils.fromWei(balance, "ether");
            showStatusMessage(`Successfully bought ${numberOfTickets} tickets! Your new balance is ${balanceInEther} TKT.`, "success");
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