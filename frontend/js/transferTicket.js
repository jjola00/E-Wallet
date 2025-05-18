$(document).ready(function() {
    $("#nav-transfer-ticket").addClass("active");

    let web3;
    let contract;
    let accounts;
    const contractAddress = "0x1fB85B7616804E0AadF7D82f8DdE73EAb41E9309"; // Updated to new address
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
            "type": "function",
            "constant": true
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
            "type": "function",
            "constant": true
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
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
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
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
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
            "type": "function",
            "constant": true
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
            "type": "function",
            "constant": true
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
            "type": "function",
            "constant": true
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
        }
    ];

    async function initializeWeb3() {
        if (typeof window.ethereum !== "undefined") {
            web3 = new Web3(window.ethereum);
            try {
                accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                contract = new web3.eth.Contract(contractABI, contractAddress);
                await checkNetwork();
                await loadVendorAddress();
            } catch (error) {
                showStatusMessage("Failed to connect to MetaMask: " + error.message, "danger");
            }
        } else {
            showStatusMessage("Please install MetaMask to use this DApp.", "danger");
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
            const vendorAddress = await contract.methods.owner().call();
            $("#vendorAddress").html(`
                <div class="alert alert-info" role="alert">
                    Vendor Address: ${vendorAddress}
                </div>
            `);
            $("#recipientAddress").val(vendorAddress);
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
            const amountInWei = web3.utils.toWei(ticketAmount, "ether");
            await contract.methods.transferTickets(recipientAddress, amountInWei).send({ from: accounts[0] });

            showStatusMessage(`Successfully transferred ${ticketAmount} tickets to ${recipientAddress}!`, "success");
        } catch (error) {
            showStatusMessage(`Error transferring tickets: ${error.message}`, "danger");
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