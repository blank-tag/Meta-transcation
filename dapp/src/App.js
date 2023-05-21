import "./App.css";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

function App() {
  const [receiver, setReceiver] = useState(" ");
  const [amount, setAmount] = useState(" ");

  const handleAccountAddressChange = (event) => {
    setReceiver(event.target.value);
    console.log("-->", receiver);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
    console.log("-->", amount);
  };

  const handleSendTransaction = () => {
    const metatransaction = "http://localhost:9000/transfer";
    const amountNumber = parseFloat(amount);

    axios
      .post(metatransaction, { receiver, amount: amountNumber })
      .then((response) => {
        setReceiver("");
        setAmount("");
        console.log("Transaction successful");
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Transaction failed");
        console.error("Error:", error);
      });
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <h1 style={{ fontWeight: "bold" }}>Meta transcation</h1>
      <TextField
        label="Account address"
        variant="outlined"
        style={{ marginBottom: "1rem" }}
        value={receiver}
        onChange={handleAccountAddressChange}
      />
      <TextField
        label="Amount"
        variant="outlined"
        value={amount}
        onChange={handleAmountChange}
        style={{ marginBottom: "1rem" }}
      />

      <Button variant="contained" onClick={handleSendTransaction}>
        Send Transaction
      </Button>
    </div>
  );
}

export default App;
