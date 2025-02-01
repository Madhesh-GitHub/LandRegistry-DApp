let web3;
let contract;
let userAccount;

// Contract ABI will be replaced after compilation
const contractABI = [{
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "landId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "area",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "LandRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "landId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "oldOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "lands",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "area",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "registered",
        "type": "bool"
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
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_area",
        "type": "uint256"
      }
    ],
    "name": "registerLand",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getLand",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
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
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "isLandRegistered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]; // This will be filled after contract compilation
const contractAddress = '0xFdb059193723899C4eC4E69F31Dc18F0dfFf65d0'; // This will be filled after deployment

window.onload = async function() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            
            // Get user account
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            document.getElementById('account').textContent = userAccount;

            // Initialize contract
            contract = new web3.eth.Contract(contractABI, contractAddress);
        } catch (error) {
            console.error("Error initializing Web3:", error);
        }
    } else {
        alert('Please install MetaMask to use this dApp!');
    }
}

async function registerLand() {
    const id = document.getElementById('regId').value;
    const location = document.getElementById('regLocation').value;
    const area = document.getElementById('regArea').value;

    try {
        await contract.methods.registerLand(id, location, area)
            .send({ from: userAccount });
        alert('Land registered successfully!');
    } catch (error) {
        alert('Error registering land: ' + error.message);
    }
}

async function transferOwnership() {
    const id = document.getElementById('transferId').value;
    const newOwner = document.getElementById('newOwner').value;

    try {
        await contract.methods.transferOwnership(id, newOwner)
            .send({ from: userAccount });
        alert('Ownership transferred successfully!');
    } catch (error) {
        alert('Error transferring ownership: ' + error.message);
    }
}

async function getLandDetails() {
    const id = document.getElementById('getLandId').value;

    try {
        const result = await contract.methods.getLand(id).call();
        document.getElementById('landDetails').innerHTML = `
            ID: ${result[0]}<br>
            Location: ${result[1]}<br>
            Area: ${result[2]} sq meters<br>
            Owner: ${result[3]}<br>
            Registered: ${result[4]}
        `;
    } catch (error) {
        alert('Error getting land details: ' + error.message);
    }
}