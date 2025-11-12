export const CONTRACT_ADDRESS="0x3F0586F61C8716cA0Ad3A0278c22d45F4567fa7B"
export const CONTRACT_ABI=[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "by",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "number",
          "type": "uint256"
        }
      ],
      "name": "NumberChanged",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "getMyNumber",
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
          "name": "_myNumber",
          "type": "uint256"
        }
      ],
      "name": "setMyNumber",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]