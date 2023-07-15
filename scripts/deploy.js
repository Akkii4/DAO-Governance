const { ethers } = require("hardhat");

async function main() {
  // Get the ContractFactory for the BasicDAO contract
  const BasicDAO = await ethers.getContractFactory("BasicDAO");

  // Deploy the contract
  const basicDAO = await BasicDAO.deploy();

  // Wait for the contract to be mined and get the deployed address
  await basicDAO.deployed();
  console.log("BasicDAO deployed to:", basicDAO.address);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
