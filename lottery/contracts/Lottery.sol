pragma solidity ^0.4.17;

contract Lottery{
    address public manager;
    address[] private players;

    constructor() public {
        manager = msg.sender;
    }

    function enter() public payable {

        //Requires the player to pay some amount of money 
        //if it is less than the specified amount then an error message is generated


        require(msg.value > 0.01 ether, "A minimum payment of .01 ether must be sent to enter the lottery");

        //if the player has paid the specified amount then his entry is pushed into players array

        players.push(msg.sender);
    }

    function listPlayers() public restrictedAccess view returns (address[]) {

        //returns the list of players that have participated

        return players;
    }

    function random() private view returns(uint) {

        //creates a pseudo random number by taking block difficulty, current time and array of players

        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }

    function pickWinner() public restrictedAccess{

        //using the pseudo random number to get the index of player that has won the prize

        uint index = random() % players.length;

        //Transfers the total prize money to the selected account by getting 
        //the address of contract and accessing its balance

        players[index].transfer(address(this).balance);  

        //initialize the players array to empty it so that next lottery can happen

        players = new address[](0);
    }

    function currentPrizePool() public view returns(uint){

        //returns the current balance that the contract has

        return address(this).balance;
    }

    //we use modifiers so that we don't have to repeat the code

    modifier restrictedAccess{

        require(msg.sender == manager, "Access Denied");

        //the _; means that wherever this modifier is used in a function
        //that function's code will be copied where the _; is placed
        //after running the code above it

        _;
    }
}