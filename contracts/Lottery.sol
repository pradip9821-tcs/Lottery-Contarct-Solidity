pragma solidity ^0.8.9;

contract Lottery {

    address     payable     public  manager;
    address     payable[]   private players;
    address     public      winner;

    constructor() {
        manager = payable(msg.sender);
    }

    function Enter() public payable {
        require(
            msg.value   > 0.01 ether 
        );
        players.push(payable(msg.sender));
    }

    function rendom() private view returns(uint) {
        return uint(
            keccak256(
                abi.encodePacked(
                    block.difficulty, 
                    block.timestamp, 
                    players
                )
            )
        );
    }

    function pickWinner() public Authorization {
        
        uint index  = rendom() % players.length;

        players[index].transfer(
            address(this).balance - (
                address(this).balance * 5 / 100
            )
        );
        winner = players[index];
        manager.transfer(address(this).balance);

        players = new address payable[](0);
    }

    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }
    

    function getPlayerCount() public view returns(uint) {
        return players.length;
    }

    modifier Authorization() {
        require(msg.sender == manager );
        _;
    }
}