pragma solidity ^0.4.17;

contract Lottery {

    address public manager;
    address[] private players;

    function Lottery() public {
        manager = msg.sender;
    }

    function Enter() public payable {
        require(msg.sender != manager);
        require(players.length < 3);
        require(msg.value > 0.01 ether ); 
        players.push(msg.sender);
    }

    function rendom() private view returns(uint) {
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public Authorization {
        
        uint index  = rendom() % players.length;

        players[index].transfer(this.balance - (this.balance * 5 / 100 ));
        manager.transfer(this.balance);

        players     = new address[](0);
    }

    function getPlayers() public view returns(address[]) {
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