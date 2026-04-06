const hre = require("hardhat");

async function main() {
  const ChainVote = await hre.ethers.getContractFactory("ChainVote");
  const chainVote = await ChainVote.deploy();

  await chainVote.waitForDeployment();

  console.log("ChainVote deployed to:", await chainVote.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
