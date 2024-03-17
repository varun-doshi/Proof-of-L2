# For withdraw event: 19445593
[https://etherscan.io/tx/0x6a5020b2ccb4222bccc08f06f5cfc9cc98beb7fb2eb70d20f4cbf2c684bf17ca](https://etherscan.io/tx/0xecee152f2c153a6a5d6c919fb5229f93222576c1436052c7d8e77bc99466b00f)
# For deposit event: 19444900
https://etherscan.io/tx/0xe115d1eb40113ab8e8337c4ec4e5df2dca4bdc39264d35c489d19055790dc152


# CLE default template


## Usage CLI

> Note: Only `full` image will be processed by zkOracle node. `unsafe` (define `unsafe: true` in the `cle.yaml`) means the CLE is compiled locally and only contains partial computation (so that proving and executing will be faster).

The workflow of local CLE development must follow: `Develop` (code in /src) -> `Compile` (get compiled wasm image) -> `Execute` (get expected output) -> `Prove` (generate input and pre-test for actual proving in zkOracle) -> `Verify` (verify proof on-chain).

To upload and publish your CLE, you should `Upload` (upload code to IPFS), and then `Publish` (register CLE on onchain CLE Registry).


## Commonly used commands

- **compile**: `npx cle compile`
- **exec**: `npx cle exec <block id>`
- **prove**: ` npx cle prove <block id> <expected state> -i|-t|-p`  
- ……

Read more: https://github.com/ora-io/cle-cli#cli
