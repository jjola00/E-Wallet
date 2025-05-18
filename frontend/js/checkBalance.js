$(document).ready(function() {
    $("#nav-check-balance").addClass("active");

    const contractAddress = "0xD5d065CB9FeC8Ce0C6A8A85Bcebfc9209D579e20";
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
        }
    ];

    let web3;
    if (typeof window.ethereum !== "undefined") {
        web3 = new Web3(window.ethereum);
        window.ethereum.request({ method: "eth_requestAccounts" })
            .then(accs => {
                $("#walletAddress").val(accs[0]);
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

    $("#checkBalanceButton").click(async function() {
        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) return;

        const walletAddress = $("#walletAddress").val().trim();

        if (!walletAddress) {
            showStatusMessage("Please enter a wallet address.", "danger");
            return;
        }

        if (!web3.utils.isAddress(walletAddress)) {
            showStatusMessage("Invalid wallet address.", "danger");
            return;
        }

        showStatusMessage("Checking balance... Please wait.", "info");
        $("#checkBalanceButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Checking...');

        try {
            const balance = await contract.methods.checkBalance(walletAddress).call();
            const balanceInEther = web3.utils.fromWei(balance, "ether");
            $("#balanceResult").html(`
                <div class="alert alert-success" role="alert">
                    Balance: ${balanceInEther} TKT
                </div>
            `);
            showStatusMessage("Balance checked successfully!", "success");
        } catch (error) {
            showStatusMessage(`Error checking balance: ${error.message}`, "danger");
        } finally {
            $("#checkBalanceButton").prop("disabled", false).html('<i class="fas fa-search me-2"></i>Check Balance');
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