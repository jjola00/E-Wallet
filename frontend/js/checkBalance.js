$(document).ready(function() {
    $("#nav-check-balance").addClass("active");

    let web3;
    let contract;
    const contractAddress = "0x1fB85B7616804E0AadF7D82f8DdE73EAb41E9309";
    const contractABI = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "numberOfTickets",
                    "type": "uint256"
                }
            ],
            "name": "TicketsBought",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "numberOfTickets",
                    "type": "uint256"
                }
            ],
            "name": "TicketsTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
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
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
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
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
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
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "accountOwner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
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
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    async function initializeWeb3() {
        if (typeof window.ethereum !== "undefined") {
            web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                contract = new web3.eth.Contract(contractABI, contractAddress);
                console.log("Contract initialized at:", contractAddress);
                checkNetwork();
            } catch (error) {
                console.error("MetaMask connection error:", error);
                showStatusMessage("Failed to connect to MetaMask: " + error.message, "danger");
            }
        } else {
            showStatusMessage("Please install MetaMask to use this DApp.", "danger");
        }
    }

    async function checkNetwork() {
        const chainId = await web3.eth.getChainId();
        console.log("Current chain ID:", chainId);
        const sepoliaChainId = 11155111;
        if (chainId !== sepoliaChainId) {
            showStatusMessage("Please switch to the Sepolia Testnet in MetaMask.", "warning");
        }
    }

    async function checkBalance() {
        const actor = $("#actorSelect").val();
        const walletAddress = $("#walletAddress").val().trim();

        if (!web3.utils.isAddress(walletAddress)) {
            showStatusMessage("Please enter a valid wallet address.", "danger");
            return;
        }

        $("#checkBalanceButton").prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i>Checking...');
        $("#refreshButton").prop("disabled", true);

        try {
            console.log("Checking balance for address:", walletAddress);

            // Test a simpler contract call to verify contract accessibility
            const ticketPrice = await contract.methods.TICKET_PRICE().call();
            console.log("TICKET_PRICE:", ticketPrice.toString());

            // Check TKT balance
            const balance = await contract.methods.checkBalance(walletAddress).call();
            console.log("Raw TKT balance:", balance.toString());
            const tktBalance = web3.utils.fromWei(balance, "ether");

            // Handle zero balance case
            if (balance.toString() === "0") {
                let balanceMessage = "";
                const sethBalanceWei = await web3.eth.getBalance(walletAddress);
                const sethBalance = web3.utils.fromWei(sethBalanceWei, "ether");
                if (actor === "Customer") balanceMessage = `Customer TKT Balance: 0 TKT`;
                else if (actor === "Vendor") balanceMessage = `Vendor TKT Balance: 0 TKT`;
                else if (actor === "Admin") {
                    const contractSethBalance = await contract.methods.getContractBalance().call();
                    const contractSeth = web3.utils.fromWei(contractSethBalance, "ether");
                    balanceMessage = `Admin TKT Balance: 0 TKT<br>Contract SETH Balance: ${contractSeth} SETH`;
                }
                $("#balanceResult").html(`<div class="alert alert-info" role="alert">${balanceMessage}</div>`);
                $("#sethBalanceResult").html(`<div class="alert alert-info" role="alert">SETH Balance: ${sethBalance} SETH</div>`);
                showStatusMessage("Balance checked (no tickets yet).", "success");
                return;
            }

            // Check SETH balance
            const sethBalanceWei = await web3.eth.getBalance(walletAddress);
            console.log("Raw SETH balance:", sethBalanceWei.toString());
            const sethBalance = web3.utils.fromWei(sethBalanceWei, "ether");

            // Display balances based on actor
            let balanceMessage = "";
            if (actor === "Customer") {
                balanceMessage = `Customer TKT Balance: ${tktBalance} TKT`;
            } else if (actor === "Vendor") {
                balanceMessage = `Vendor TKT Balance: ${tktBalance} TKT`;
            } else if (actor === "Admin") {
                const contractSethBalance = await contract.methods.getContractBalance().call();
                console.log("Raw contract SETH balance:", contractSethBalance.toString());
                const contractSeth = web3.utils.fromWei(contractSethBalance, "ether");
                balanceMessage = `Admin TKT Balance: ${tktBalance} TKT<br>Contract SETH Balance: ${contractSeth} SETH`;
            }

            $("#balanceResult").html(`
                <div class="alert alert-info" role="alert">
                    ${balanceMessage}
                </div>
            `);
            $("#sethBalanceResult").html(`
                <div class="alert alert-info" role="alert">
                    SETH Balance: ${sethBalance} SETH
                </div>
            `);

            showStatusMessage("Balance checked successfully!", "success");
        } catch (error) {
            console.error("Balance check error:", error);
            if (error.message.includes("revert")) {
                console.log("Revert reason (if available):", error.data?.message || "No additional data");
            }
            showStatusMessage(`Error checking balance: ${error.message}`, "danger");
        } finally {
            $("#checkBalanceButton").prop("disabled", false).html('<i class="fas fa-search me-2"></i>Check Balance');
            $("#refreshButton").prop("disabled", false);
        }
    }

    $("#checkBalanceButton").click(checkBalance);
    $("#refreshButton").click(checkBalance);

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