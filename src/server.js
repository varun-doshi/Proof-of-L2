const express = require("express");
const app = express();
const port = 3002;
const { Exec } = require("./exec.js");
const { ethers } = require("ethers");
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

  let temp = null;
  try {
    await Exec(blockNum).then((ret) => {
      temp = ret;
    });
  } catch (error) {
    console.log("the error:", error);
  }

  let action_type = parseInt(temp.toString().substring(0, 8));
  let data = temp.toString().substring(8);
  console.log("the log:", action_type);
  let r = "0x" + data;
  let parse_data = parseInt(Number(r)).toString();

  res.send(parse_data.toString());
});

// app.post("/mintNFT", async (req, res) => {
//   const { dataUrl, gameInfo, ownerAddress } = req.body;

//   await mintNFT(dataUrl, gameInfo, ownerAddress)
//     .then((ret) => {
//       res.status(200).json({ ret });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: err });
//     });
// });

app.listen(port, () => {
  console.log(__dirname + "cle.yaml");
  console.log(`Server is running on http://localhost:${port}`);
});
