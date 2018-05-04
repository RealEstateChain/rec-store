pragma solidity ^0.4.17;

contract Adoption {
  address[12] public buyers;
  // Adopting a pet
  function adopt(uint homeId) public returns (uint) {
    require(homeId >= 0 && homeId <= 11);

    buyers[homeId] = msg.sender;

    return homeId;
  }

  // Retrieving the buyers
function getAdopters() public view returns (address[12]) {
  return buyers;
}

}
