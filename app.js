const cors = require("cors");
const express = require("express");
const { transferAmount } = require("./service/chain");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    return res.status(200).json({ message: "MetaTranscation" });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.post("/transfer", async (req, res) => {
  try {
    const receiver = req.body.receiver;
    const amount = req.body.amount;

    if (!amount || receiver.length < 42) {
      return res.status(400).json({
        message: "receiver amount is empty",
      });
    }

    return await transferAmount(receiver, amount).then((result) =>
      res.status(200).json(result)
    );
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.listen(9000, () => console.log("running port 9000"));
