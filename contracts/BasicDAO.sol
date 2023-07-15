// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title A basic DAO contract for managing proposals and voting
 * @dev The contract allows adding and removing members, creating proposals, and voting on proposals
 */
contract BasicDAO {
    // Proposal structure
    struct Proposal {
        string description; // description of the proposal
        uint256 voteCount; // total votes received for the proposal
        bool executed; // whether the proposal has been executed or not
    }

    // Member structure
    struct Member {
        address memberAddress; // address of the member
        uint256 memberSince; // time since the member joined
        uint256 tokenBalance; // token balance of the member
    }

    // Array of member addresses
    address[] public members;
    // Array of proposals
    Proposal[] public proposals;
    // Total supply of tokens
    uint256 public totalSupply;

    // Mapping of member information
    mapping(address => Member) public memberInfo;
    // Mapping of whether a member has voted for a proposal or not
    mapping(address => mapping(uint256 => bool)) public votes;
    // Mapping of member token balances
    mapping(address => uint256) public balances;

    // Events
    event ProposalCreated(uint256 indexed proposalId, string description);
    event VoteCast(
        address indexed voter,
        uint256 proposalId,
        uint256 tokenAmount
    );

    /**
     * @dev Add a new member to the DAO
     * @param _memberAddress Address of the member to be added
     */
    function addNewMember(address _memberAddress) public {
        // Check if the member already exists
        require(
            memberInfo[_memberAddress].memberAddress == address(0),
            "Member already exists"
        );

        // Add the member to the memberInfo mapping
        memberInfo[_memberAddress] = Member({
            memberAddress: _memberAddress,
            memberSince: block.timestamp,
            tokenBalance: 100
        });

        // Add the member to the members array
        members.push(_memberAddress);

        // Update the member token balance and the total supply
        balances[_memberAddress] = 100;
        totalSupply += 100;
    }

    /**
     * @dev Remove a member from the DAO
     * @param _memberAddress Address of the member to be removed
     */
    function removeMember(address _memberAddress) public {
        // Check if the member exists
        require(
            memberInfo[_memberAddress].memberAddress != address(0),
            "Member does not exist"
        );

        // Remove the member from the memberInfo mapping
        memberInfo[_memberAddress] = Member({
            memberAddress: address(0),
            memberSince: 0,
            tokenBalance: 0
        });

        // Remove the member from the members array
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == _memberAddress) {
                // Swap the member with the last member in the array
                members[i] = members[members.length - 1];
                // Remove the last member from the array
                members.pop();
                break;
            }
        }

        // Update the member token balance and the total supply
        balances[_memberAddress] = 0;
        totalSupply -= 100;
    }

    /**
     * @dev Create a new proposal
     * @param _description Description of the proposal
     */
    function createNewProposal(string memory _description) public {
        // Add the proposal to the proposals array
        proposals.push(
            Proposal({description: _description, voteCount: 0, executed: false})
        );

        // Emit the ProposalCreated event
        emit ProposalCreated(proposals.length - 1, _description);
    }

    /**
     * @dev Vote for a proposal
     * @param _proposalId ID of the proposal to vote for
     * @param _tokenAmount Amount of tokens to vote with
     */
    function castVote(uint256 _proposalId, uint256 _tokenAmount) public {
        // Check if the voter is a member
        require(
            memberInfo[msg.sender].memberAddress != address(0),
            "Only members can vote"
        );

        // Check if the voter has enough tokens
        require(balances[msg.sender] >= _tokenAmount, "Not enough tokens");

        // Check if the voter has not already voted for the proposal
        require(votes[msg.sender][_proposalId] == false, "Already voted");

        // Mark the voter as having voted for the proposal
        votes[msg.sender][_proposalId] = true;

        // Update the voter's token balance and the proposal's vote count
        memberInfo[msg.sender].tokenBalance -= _tokenAmount;
        proposals[_proposalId].voteCount += _tokenAmount;

        // Emit the VoteCast event
        emit VoteCast(msg.sender, _proposalId, _tokenAmount);
    }

    /**
     * @dev Execute a proposal
     * @param _proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 _proposalId) public {
        // Check if the proposal has not been executed yet
        require(
            proposals[_proposalId].executed == false,
            "Proposal already executed"
        );

        // Check if the proposal has received enough votes
        require(
            proposals[_proposalId].voteCount > totalSupply / 2,
            "Not enough votes"
        );

        // Mark the proposal as executed
        proposals[_proposalId].executed = true;
    }
}
