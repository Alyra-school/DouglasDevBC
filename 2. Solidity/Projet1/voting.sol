// Licence MIT pour le contrat
// SPDX-License-Identifier: MIT

// Définition de la version du compilateur Solidity à utiliser
pragma solidity 0.8.28;

// Import du contrat Ownable d'OpenZeppelin qui gère les permissions
import "@openzeppelin/contracts/access/Ownable.sol";

// Définition du contrat Voting qui hérite des fonctionnalités de Ownable
contract Voting is Ownable {
    // ============ CUSTOM ERRORS ============
    
    /// @notice Erreur émise quand l'utilisateur n'est pas un votant enregistré
    error NotRegisteredVoter();
    /// @notice Erreur émise quand l'état du workflow n'est pas correct
    error InvalidWorkflowStatus(WorkflowStatus current, WorkflowStatus required);
    /// @notice Erreur émise quand le votant est déjà enregistré
    error AlreadyRegistered();
    /// @notice Erreur émise quand le votant a déjà voté
    error AlreadyVoted();
    /// @notice Erreur émise quand la proposition n'existe pas
    error ProposalNotFound(uint256 proposalId);
    /// @notice Erreur émise quand la description de proposition est vide
    error EmptyProposalDescription();
    /// @notice Erreur émise quand l'adresse est invalide
    error InvalidAddress();
    /// @notice Erreur émise quand il n'y a pas de propositions
    error NoProposals();

    // ============ STATE VARIABLES ============
    
    /// @notice Identifiant de la proposition gagnante
    uint256 public winningProposalID;
    
    /// @notice État actuel du workflow
    WorkflowStatus public workflowStatus;
    
    /// @notice Tableau des propositions
    Proposal[] public proposalsArray;
    
    /// @notice Mapping des votants par adresse
    mapping(address => Voter) public voters;
    
    /// @notice Compteur du nombre total de votants enregistrés
    uint256 public votersCount;
    
    /// @notice Compteur du nombre total de votes exprimés
    uint256 public totalVotes;

    // ============ STRUCTS ============
    
    /// @notice Structure qui définit les propriétés d'un votant
    struct Voter {
        bool isRegistered;      // Si le votant est enregistré
        bool hasVoted;          // Si le votant a déjà voté
        uint256 votedProposalId; // ID de la proposition votée
    }

    /// @notice Structure qui définit les propriétés d'une proposition
    struct Proposal {
        // Description textuelle de la proposition
        string description;
        // Compteur du nombre de votes reçus par la proposition
        uint voteCount;
    }

    // ============ ENUMS ============
    
    /// @notice États possibles du processus de vote
    enum WorkflowStatus {
        RegisteringVoters,           // Enregistrement des votants
        ProposalsRegistrationStarted, // Début enregistrement propositions
        ProposalsRegistrationEnded,   // Fin enregistrement propositions
        VotingSessionStarted,         // Début session de vote
        VotingSessionEnded,           // Fin session de vote
        VotesTallied                  // Votes comptabilisés
    }

    // ============ EVENTS ============
    
    /// @notice Émis quand un nouveau votant est enregistré
    event VoterRegistered(address indexed voterAddress);
    /// @notice Émis quand l'état du workflow change
    event WorkflowStatusChange(WorkflowStatus indexed previousStatus, WorkflowStatus indexed newStatus);
    /// @notice Émis quand une nouvelle proposition est enregistrée
    event ProposalRegistered(uint256 indexed proposalId, address indexed proposer);
    /// @notice Émis quand un votant vote
    event Voted(address indexed voter, uint256 indexed proposalId);


    // ============ CONSTRUCTOR ============
    
    /// @notice Constructeur du contrat
    constructor() Ownable(msg.sender) {}

    // ============ MODIFIERS ============
    
    /// @notice Vérifie que l'appelant est un votant enregistré
    modifier onlyVoters() {
        if (!voters[msg.sender].isRegistered) {
            revert NotRegisteredVoter();
        }
        _;
    }
    
    /// @notice Vérifie que l'état du workflow est correct
    modifier onlyInState(WorkflowStatus _status) {
        if (workflowStatus != _status) {
            revert InvalidWorkflowStatus(workflowStatus, _status);
        }
        _;
    }
    
    /// @notice Vérifie que l'adresse n'est pas nulle
    modifier validAddress(address _addr) {
        if (_addr == address(0)) {
            revert InvalidAddress();
        }
        _;
    }

    // ============ GETTERS ============
    
    /// @notice Retourne les informations d'un votant
    /// @param _addr Adresse du votant
    /// @return Voter Les informations du votant
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }
    
    // Fonction qui retourne les informations d'une proposition spécifique
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        // Retourne la proposition à l'index spécifié
        return proposalsArray[_id];
    }

    // ============ REGISTRATION ============
    
    /// @notice Ajoute un nouveau votant (owner only)
    /// @param _addr Adresse du votant à ajouter
    function addVoter(address _addr) external onlyOwner validAddress(_addr) onlyInState(WorkflowStatus.RegisteringVoters) {
        if (voters[_addr].isRegistered) {
            revert AlreadyRegistered();
        }
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ============ PROPOSAL ============
    
    /// @notice Ajoute une nouvelle proposition
    /// @param _desc Description de la proposition
    function addProposal(string calldata _desc) external onlyVoters onlyInState(WorkflowStatus.ProposalsRegistrationStarted) {
        if (bytes(_desc).length == 0) {
            revert EmptyProposalDescription();
        }

        proposalsArray.push(Proposal({
            description: _desc,
            voteCount: 0,
            proposer: msg.sender
        }));
        
        emit ProposalRegistered(proposalsArray.length - 1, msg.sender);
    }

    // ============ VOTE ============
    
    /// @notice Vote pour une proposition
    /// @param _id ID de la proposition
    function setVote(uint256 _id) external onlyVoters onlyInState(WorkflowStatus.VotingSessionStarted) {
        if (voters[msg.sender].hasVoted) {
            revert AlreadyVoted();
        }
        if (_id >= proposalsArray.length) {
            revert ProposalNotFound(_id);
        }

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;
        // Émet l'événement de vote
        emit Voted(msg.sender, _id);
    }

    // ============ STATE MANAGEMENT ============
    
    /// @notice Démarre l'enregistrement des propositions
    function startProposalsRegistering() external onlyOwner onlyInState(WorkflowStatus.RegisteringVoters) {
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        
        // Ajoute la proposition GENESIS
        proposalsArray.push(Proposal({
            description: "GENESIS",
            voteCount: 0,
            proposer: address(0)
        }));
        
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    /// @notice Termine l'enregistrement des propositions
    function endProposalsRegistering() external onlyOwner onlyInState(WorkflowStatus.ProposalsRegistrationStarted) {
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    /// @notice Démarre la session de vote
    function startVotingSession() external onlyOwner onlyInState(WorkflowStatus.ProposalsRegistrationEnded) {
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    /// @notice Termine la session de vote
    function endVotingSession() external onlyOwner onlyInState(WorkflowStatus.VotingSessionStarted) {
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    /// @notice Comptabilise les votes et détermine le gagnant
    function tallyVotes() external onlyOwner onlyInState(WorkflowStatus.VotingSessionEnded) {
        if (proposalsArray.length == 0) {
            revert NoProposals();
        }
        
        uint256 _winningProposalId = 0;
        uint256 maxVotes = proposalsArray[0].voteCount;
        
        // Trouve la proposition avec le plus de votes
        for (uint256 i = 1; i < proposalsArray.length; i++) {
            if (proposalsArray[i].voteCount > maxVotes) {
                maxVotes = proposalsArray[i].voteCount;
                _winningProposalId = i;
            }
        }
        
        winningProposalID = _winningProposalId;
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.VotesTallied;
        
        emit VotesTallied(_winningProposalId, maxVotes);
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }
    
    // ============ UTILITY FUNCTIONS ============
    
    /// @notice Retourne les statistiques du vote
    /// @return _totalVoters Nombre total de votants enregistrés
    /// @return _totalVotes Nombre total de votes exprimés
    /// @return _proposalsCount Nombre de propositions
    /// @return _winningProposalId ID de la proposition gagnante
    function getVotingStats() external view returns (
        uint256 _totalVoters,
        uint256 _totalVotes,
        uint256 _proposalsCount,
        uint256 _winningProposalId
    ) {
        return (votersCount, totalVotes, proposalsArray.length, winningProposalID);
    }
    
    /// @notice Vérifie si un votant a voté
    /// @param _addr Adresse du votant
    /// @return bool True si le votant a voté
    function hasVoted(address _addr) external view returns (bool) {
        return voters[_addr].hasVoted;
    }
    
    /// @notice Retourne la proposition pour laquelle un votant a voté
    /// @param _addr Adresse du votant
    /// @return uint256 ID de la proposition votée
    function getVotedProposal(address _addr) external view returns (uint256) {
        return voters[_addr].votedProposalId;
    }
}