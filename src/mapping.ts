//@ts-ignore
import { BigInt, require } from "@ora-io/cle-lib";
import { Bytes, Block, Event } from "@ora-io/cle-lib";

let addr = Bytes.fromHexString("0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287");
let esig_commit = Bytes.fromHexString(
  "0xba5de06d22af2685c6c7765f60067f7d2b08c2d29f53cdf14d67f6d1c9bfb527"
);

export function handleBlocks(blocks: Block[]): Bytes {
  // #1 can access all (matched) events of the latest block
  let events: Event[] = blocks[0].account(addr).eventsByEsig(esig_commit);

  require(events.length > 0);

  // set state to the address of the 1st (matched) event, demo purpose only.
  let proposer = events[0].topic1;
  let headBlock = BigInt.fromBytes(events[0].topic2).toString();

  return Bytes.fromHexString(headBlock);
}

//000000000000000000000000000000000000000000000000000000002307e540
// 22 24 25 26 27 28 29 30 31
