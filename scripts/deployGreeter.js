//const {ethers} = require("ethers");
const hre = require("hardhat");
const artifact = require("../src/artifacts/contracts/Greeter.sol/Greeter.json")
const abi = artifact.abi;
const bytecode = artifact.deployedBytecode; 


async function main() {
  console.log("1")
  const Greeter =  await hre.ethers.getContractFactory("Greeter");
  console.log("2")
  const greeterContract = await Greeter.deploy();
  console.log("3")
  await greeterContract.deployed();
  console.log(`Deployed Greeter Contract: ${greeterContract.address}`);
/* 
  console.log("Set msg")
  await greeterContract.setMessage("2nd message");
  await greeterContract.setMessage("3rd message");
  await greeterContract.setMessage("4th message");

  console.log("Get Msg")
  const getMsj = await greeterContract.getMessage();
  console.log(getMsj)

  console.log("Get arr")
  const getArr = await greeterContract.getMessages()
  console.log(getArr) */

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
