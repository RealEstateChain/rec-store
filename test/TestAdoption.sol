pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
  Adoption adoption = Adoption(DeployedAddresses.Adoption());

    // Testing the adopt() function
  function testUserCanAdoptPet() public {
    uint returnedId = adoption.adopt(8);

    uint expected = 8;

    Assert.equal(returnedId, expected, "Adoption of pet ID 8 should be recorded.");
  }

  // Testing retrieval of a single pet's owner
  function testGetAdopterAddressByhomeId() public {
    // Expected owner is this contract
    address expected = this;

    address buyer = adoption.buyers(8);

    Assert.equal(buyer, expected, "Owner of pet ID 8 should be recorded.");
  }

    // Testing retrieval of all pet owners
  function testGetAdopterAddressByhomeIdInArray() public {
    // Expected owner is this contract
    address expected = this;

    // Store buyers in memory rather than contract's storage
    address[12] memory buyers = adoption.getAdopters();

    Assert.equal(buyers[8], expected, "Owner of pet ID 8 should be recorded.");
  }

}
