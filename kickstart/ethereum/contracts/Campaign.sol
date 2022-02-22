pragma solidity ^0.4.17;

contract Factory{
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public{
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);

    }

    function listCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }

}


contract Campaign {
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted(){
        require(address(msg.sender) == manager,"Only Manager can use this");
        _;
    }

    constructor(uint minimum, address user) public{
        manager = user;
        minimumContribution = minimum;
    }

    function contribute() public payable{
        require (msg.value >= minimumContribution  , "A minimum contribution is required");

         if(approvers[address(msg.sender)]){
            //do nothing
        } else{
            approvers[address(msg.sender)] = true;
            approversCount++;
        }
    }

    function createRequest(string description, uint value, address recipient ) public  restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public{
        Request storage request = requests[index];

        require(approvers[address(msg.sender)], "You need to be a contributer");
        require(!request.approvals[address(msg.sender)], "You have already voted for this request");

        request.approvals[address(msg.sender)] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        
        require(!request.complete, "Request already completed");
        require(request.approvalCount > (approversCount / 2)  , "Not enough contributers have approved the request");
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }
 
    function getSummary() public view returns (
        uint , uint, uint, uint, address ) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint){
        return requests.length;
    }
}