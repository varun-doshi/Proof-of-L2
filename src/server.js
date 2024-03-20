const express = require("express");
const app = express();
const port = 3002;
const { Exec } = require("./exec.js");
const { ethers } = require("ethers");
const getTokenPrice = require("./helpers/getTokenPrice.js");
const Moralis = require("moralis").default;

// const cors = require("cors");
// const bodyParser = require("body-parser");
// app.use(
//   cors({
//     origin: "http://localhost:3000", // replace with the origin you want to allow
//   })
// );
// app.use(bodyParser.json());

// const { mintNFT } = require("./mintNFT");

app.post("/api", async (req, res) => {
  // console.log(req.query, typeof req.query.blockNum)
  const blockNum = parseInt(req.query.blockNum);
  console.log(blockNum, typeof blockNum);
  let borrowed = 0;
  let temp = null;
  //19445162
  //19445193
  try {
    for (let i = blockNum; i <= 19445193; i++) {
      console.log("running block", i);
      try {
        await Exec(i).then((ret) => {
          temp = ret;
        });
      } catch (error) {
        continue;
      }
      let data = temp.substring(24);
      let reserve = data.toString().substring(0, 40);
      let data2 = data.substring(40);
      let user = data2.toString().substring(0, 40);
      let amount = data2.substring(64);
      let parse_data = BigInt("0x" + amount);
      console.log(parse_data);
      let final_value = await getTokenPrice(reserve, parse_data);

      borrowed = borrowed + final_value;
      console.log("the log:", borrowed);
    }
    console.log("Process completed successfully");
  } catch (error) {
    console.log("the error:", error);
  }

  res.status(200).send(borrowed.toString());
});

app.post("/repay", async (req, res) => {
  const blockNum = parseInt(req.query.blockNum);
  console.log(blockNum, typeof blockNum);
  let borrowed = 0;
  let temp = null;
  //19445162
  //19445193
  try {
    // for (let i = blockNum; i <= 19445193; i++) {
    console.log("running block", blockNum);
    // try {
    await Exec(blockNum).then((ret) => {
      temp = ret;
    });
    // } catch (error) {
    // continue;
    // }
    // let data = temp.substring(24);
    // let reserve = data.toString().substring(0, 40);
    // let data2 = data.substring(40);
    // let user = data2.toString().substring(0, 40);
    // let amount = data2.substring(64);
    // let parse_data = BigInt("0x" + amount);
    console.log(temp);
    // let final_value = await getTokenPrice(reserve, parse_data);

    // borrowed = borrowed + final_value;
    // console.log("the log:", borrowed);
    // }
    console.log("Process completed successfully");
  } catch (error) {
    console.log("the error:", error);
  }

  // res.status(200).send(borrowed.toString());
  res.status(200).send(temp);
});

app.listen(port, async () => {
  console.log(__dirname + "cle.yaml");
  console.log(`Server is running on http://localhost:${port}`);
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
});
