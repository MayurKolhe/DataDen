const hre = require("hardhat");
// const { ethers } = require("ethers");

async function main() {
  const DataDen = await hre.ethers.getContractFactory("DataDen");
  const myContract = await DataDen.deploy();
  console.log("Contract Deployed to Address:", myContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
