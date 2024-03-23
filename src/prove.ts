/* eslint-disable no-console */
import * as cleapi from "@ora-io/cle-api";
import * as fs from "node:fs";
import { ethers } from "ethers";
// import { loadYamlFromPath } from "@ora-io/cle-api";

(global as any).__BROWSER__ = false;

interface NetworksConfig {
  mainnet?: any; // Optional
  sepolia?: any; // Optional
  goerli?: any; // Optional
}
const networkConfig: NetworksConfig = {
  sepolia: "https://eth-sepolia.public.blastapi.io",
};

const config = {
  JsonRpcProviderUrl: {
    // Erigon node rpc are highly recommended here.
    mainnet:
      "https://eth-mainnet.g.alchemy.com/v2/7dPsv4k9QI6KAuCyfQSF3tzdY7coYthq",
    sepolia: "https://eth-sepolia.public.blastapi.io",
  },
  UserPrivateKey: "0x{key}",
};

const execOptionsForEvent = {
  wasmPath: __dirname + "/cle.wasm",
  yamlPath: __dirname + "/cle.yaml",
  //   local: false,
};

function loadConfigByNetwork(
  yaml: cleapi.CLEYaml,
  networksConfig: NetworksConfig,
  isDataSource: boolean
) {
  let network: string | undefined;
  if (yaml.dataSources?.[0].kind !== "ethereum")
    throw new Error("loadConfigByNetwork only support ethereum right now.");

  // For exec and prove, we need to load the data source network
  if (isDataSource) network = yaml.dataSources?.[0].network;
  // For publish & verify, we need to load the data destination network
  else network = yaml.dataDestinations?.[0].network;

  // TODO: move health check
  if (!network) {
    throw new Error(
      `Network of "${
        isDataSource ? "dataSource" : "dataDestination"
      }" is not defined in yaml.`
    );
  }

  // Check if the network is defined in constants.
  // const targetNetwork = getTargetNetwork(network)?.name.toLowerCase()
  // let targetConfig = ''
  // if (targetNetwork) {
  const targetConfig = networksConfig
    ? (networksConfig as any)[network]
    : undefined;
  // }

  if (!targetConfig) {
    throw new Error(
      `[-] networksConfig for network "${network}" is not found in zkgraph-api.`
    );
  }

  return targetConfig;
}

export async function generateProof(blocknum: any, expectedState: any) {
  const { wasmPath, yamlPath } = execOptionsForEvent;

  const wasm = fs.readFileSync(wasmPath, "utf-8");
  const wasmUint8Array = new TextEncoder().encode(wasm);
  // new Uint8Array(wasm);
  const yamlContent = fs.readFileSync(yamlPath, "utf-8");
  const yaml = cleapi.CLEYaml.fromYamlContent(yamlContent);
  const dsp = cleapi.dspHub.getDSPByYaml(yaml, {});

  const jsonRpcUrl = loadConfigByNetwork(yaml, config.JsonRpcProviderUrl, true);
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl);
  const generalParams = {
    provider,
    blockId: blocknum,
    expectedStateStr: expectedState,
  };
  console.log("General params:", generalParams);

  const proveParams = dsp?.toProveParams(generalParams);

  const input = await cleapi.proveInputGen(
    { cleYaml: yaml }, // doesn't care about wasmUint8Array
    proveParams as any
  );

  // const result = await cleapi.prove(yaml, input, cleapi.BatchStyle.ZKWASMHUB);

  console.log(input.auxParams);
  const userPrivateKey =
    "0x845f95446b66a3f714df0148393f61ad6dc7881223cdc2c41c9e2ef2ab7030aa";
  const zkwasmHub = "https://rpc.zkwasmhub.com:8090";

  const signer = new ethers.Wallet(userPrivateKey, provider);

  const result = await cleapi.requestProve(
    { wasmUint8Array }, // doesn't care about cleYaml
    input,
    {
      proverUrl: zkwasmHub,
      signer,
      batchStyle: cleapi.BatchStyle.ZKWASMHUB,
    }
  );

  // console.log(result.taskDetails);
  console.log(result.taskId);

  // const execParams = dsp?.toExecParams(generalParams);

  // const state = await cleapi.execute(
  //   { wasmUint8Array, cleYaml: yaml },
  //   execParams as any
  // );

  // return Buffer.from(state).toString("hex");
}
