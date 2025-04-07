$(document).ready(function() {
    $("#nav-check-balance").addClass("active");

    const contractAddress = "0xFD971Cf89A4F14CD26ec7d4809E7DdB9111943b5"; 
    const contractABI = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
    ]; 

    let web3;
    if (typeof window.ethereum !== "undefined") {
        web3 = new Web3(window.ethereum);
    } else {
        showStatusMessage("Please install MetaMask to use this DApp.", "danger");
        return;
    }

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    $("#checkBalanceButton").click(async function() {
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
            // Call the checkBalance function on the contract
            const balance = await contract.methods.checkBalance(walletAddress).call();
            // Convert balance from wei to ether (since the contract uses 18 decimals)
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