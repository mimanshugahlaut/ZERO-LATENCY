const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const EXPECTED_NETWORK = "localhost";

const FRONTEND_UTILS_DIR = path.resolve(__dirname, "../../frontend/src/utils");
const FRONTEND_PUBLIC_DIR = path.resolve(__dirname, "../../frontend/public");

const FRONTEND_ADDRESS_FILE = path.join(FRONTEND_UTILS_DIR, "contract-address.json");
const FRONTEND_PUBLIC_ADDRESS_FILE = path.join(FRONTEND_PUBLIC_DIR, "contract-address.json");
const FRONTEND_ARTIFACT_FILE = path.join(FRONTEND_UTILS_DIR, "ChainVote.json");

function writeJson(targetPath, data) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
}

async function main() {
  if (hre.network.name !== EXPECTED_NETWORK) {
    throw new Error(
      `Deploy aborted: expected network "${EXPECTED_NETWORK}", got "${hre.network.name}". ` +
      `Run: npx hardhat run scripts/deploy.js --network localhost`
    );
  }

  console.log(`[deploy] Network: ${hre.network.name}`);

  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error("Deploy aborted: no deployer account found.");
  }
  console.log(`[deploy] Deployer: ${deployer.address}`);

  const ChainVote = await hre.ethers.getContractFactory("ChainVote");
  const chainVote = await ChainVote.deploy();

  await chainVote.waitForDeployment();
  const contractAddress = await chainVote.getAddress();
  const runtimeCode = await hre.ethers.provider.getCode(contractAddress);

  if (!runtimeCode || runtimeCode === "0x") {
    throw new Error(
      `Deploy failed: no runtime bytecode found at ${contractAddress}.`
    );
  }

  const artifact = await hre.artifacts.readArtifact("ChainVote");
  const network = await hre.ethers.provider.getNetwork();

  const addressPayload = {
    address: contractAddress,
    chainId: Number(network.chainId),
    network: hre.network.name,
    updatedAt: new Date().toISOString(),
  };

  writeJson(FRONTEND_ADDRESS_FILE, addressPayload);
  writeJson(FRONTEND_PUBLIC_ADDRESS_FILE, addressPayload);
  writeJson(FRONTEND_ARTIFACT_FILE, artifact);

  console.log(`[deploy] ChainVote deployed to: ${contractAddress}`);
  console.log(`[deploy] Runtime bytecode size: ${(runtimeCode.length - 2) / 2} bytes`);
  console.log(`[deploy] Synced: ${FRONTEND_ADDRESS_FILE}`);
  console.log(`[deploy] Synced: ${FRONTEND_PUBLIC_ADDRESS_FILE}`);
  console.log(`[deploy] Synced: ${FRONTEND_ARTIFACT_FILE}`);
}

main().catch((error) => {
  console.error("[deploy] Error:", error);
  process.exitCode = 1;
});
