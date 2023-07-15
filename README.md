# BasicDAO Contract

This is a Solidity smart contract that implements a basic DAO (Decentralized Autonomous Organization) for managing proposals and voting. The contract allows adding and removing members, creating proposals, and voting on proposals.

## Contract Details

### Proposal Structure

The contract defines a Proposal struct, which has the following fields:

- `description`: a string that describes the proposal
- `voteCount`: a uint256 that keeps track of the total votes received for the proposal
- `executed`: a boolean that indicates whether the proposal has been executed or not

### Member Structure

The contract defines a Member struct, which has the following fields:

- `memberAddress`: the address of the member
- `memberSince`: a uint256 that keeps track of the time since the member joined
- `tokenBalance`: a uint256 that represents the token balance of the member

### Storage Variables

The contract has the following storage variables:

- `members`: an array of member addresses
- `proposals`: an array of proposals
- `totalSupply`: a uint256 that represents the total supply of tokens
- `memberInfo`: a mapping of member information, keyed by member address
- `votes`: a mapping of whether a member has voted for a proposal or not, keyed by member address and proposal ID
- `balances`: a mapping of member token balances, keyed by member address

### Events

The contract emits the following events:

- `ProposalCreated`: emitted when a new proposal is created, with the proposal ID and description as parameters
- `VoteCast`: emitted when a member casts a vote for a proposal, with the voter address, proposal ID, and token amount as parameters

### Functions

The contract has the following functions:

- `addNewMember`: adds a new member to the DAO, with the specified member address
- `removeMember`: removes a member from the DAO, with the specified member address
- `createNewProposal`: creates a new proposal with the specified description
- `castVote`: allows a member to cast a vote for a proposal, with the specified proposal ID and token amount
- `executeProposal`: executes a proposal with the specified proposal ID

## Usage

To use the BasicDAO contract, deploy it to the Ethereum blockchain using a Solidity compiler and interact with it using a web3-enabled application. 

### Adding Members

To add a new member, call the `addNewMember` function with the member's Ethereum address as the parameter. This will add the member to the `members` array and the `memberInfo` mapping, and give the member an initial token balance of 100.

### Removing Members

To remove a member, call the `removeMember` function with the member's Ethereum address as the parameter. This will remove the member from the `members` array and the `memberInfo` mapping, and set the member's token balance to 0.

### Creating Proposals

To create a new proposal, call the `createNewProposal` function with a string parameter that describes the proposal. This will add the proposal to the `proposals` array and emit a `ProposalCreated` event with the proposal ID and description.

### Casting Votes

To cast a vote for a proposal, call the `castVote` function with the proposal ID and the amount of tokens to vote with as parameters. This will check that the voter is a member, has enough tokens, and has not already voted for the proposal. If all checks pass, the function will mark the voter as having voted for the proposal, update the voter's token balance and the proposal's vote count, and emit a `VoteCast` event with the voter address, proposal ID, and token amount.

### Executing Proposals

To execute a proposal, call the `executeProposal` function with the proposal ID as the parameter. This will check that the proposal has not already been executed and has received enough votes. If all checks pass, the function will mark the proposal as executed.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
