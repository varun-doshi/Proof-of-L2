const express = require("express");
const app = express();
const port = 3002;
const { Exec } = require("./exec.js");
const { generateProof } = require("./prove.js");
const { ethers } = require("ethers");
const getTokenPrice = require("./helpers/getTokenPrice.js");
const Moralis = require("moralis").default;
const cle = require("@ora-io/cle-api");
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
  let repayed = 0;
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

      repayed = repayed + final_value;
      console.log("the log:", repayed);
    }
    console.log("Process completed successfully");
  } catch (error) {
    console.log("the error:", error);
  }

  res.status(200).send(repayed.toString());
});

app.post("/final", async (req, res) => {
  //call 2 apis from here:
  //  /repay and /borrow
  // result=repay_result-borrow_result
});

app.post("/repay", async (req, res) => {
  const blockNum = parseInt(req.query.blockNum);
  const address = req.query.user;
  // console.log(address.toString());
  let repayed = 0;
  let temp = null;

  try {
    for (let i = blockNum; i <= 19484975; i++) {
      console.log("running block", i);
      try {
        await Exec(i).then((ret) => {
          temp = ret;
        });
      } catch (error) {
        continue;
      }
      let data = temp.substring(24);

      let reserve = "0x" + data.toString().substring(0, 40);
      console.log("reserve:", reserve);
      let data2 = data.substring(64);
      let user = "0x" + data2.toString().substring(0, 40);
      if (user != address.toLowerCase()) {
        continue;
      }
      // console.log("user:", user);
      let amount = data2.substring(64);
      let parse_data = BigInt("0x" + amount);
      // console.log(parse_data);
      let final_value = await getTokenPrice(reserve, parse_data);
      // console.log(final_value);

      repayed = repayed + final_value;
      console.log("the log:", repayed);
    }
    console.log("Process completed successfully");
  } catch (error) {
    console.log("the error:", error);
  }

  res.status(200).send(repayed.toString());
  // res.status(200).send(temp);
});

app.get("/proof", async (req, res) => {
  await generateProof(
    19473959,
    "000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000054c2778651e055c40d1af89c33276ec61dbda73c00000000000000000000000000000000000000000000000000000002ac8c3ce6"
  );
});

app.listen(port, async () => {
  console.log(__dirname + "cle.yaml");
  console.log(`Server is running on http://localhost:${port}`);
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
});

//000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000bed4dbd30fd3aed29c2d133fddb611f8aa517c6b00000000000000000000000000000000000000000000000000000002540be400
