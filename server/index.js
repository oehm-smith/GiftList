const express = require('express');
const verifyProof = require('../utils/verifyProof');
const niceList = require('../utils/niceList.json');
const MerkleTree = require("../utils/MerkleTree")
const { bytesToHex } = require("ethereum-cryptography/utils")

const port = 1225;
const app = express();
app.use(express.json());

const merkleTree = new MerkleTree(niceList);

/*
 * 32 bytes of data representing the whole nice list - if the niceList is changed then you need to regenerate this -
 * Regeneration:
 * const root = merkleTree.getRoot();
 * const root_bytes_data = hexToBytes(root)
 */
const root_bytes_data = [221,213,154,47,252,205,221,96,255,71,153,51,18,130,28,213,124,243,15,127,20,251,130,147,126,190,44,77,199,131,117,170]

app.post('/gift', (req, res) => {
  const {name} = req.body;
  if (! name) {
    return res.status(400).send(`'name' body param required`)
  }

  // Prove that a name is in the list
  const index = niceList.findIndex(n => n === name);
  const proof = merkleTree.getProof(index);
  const isInTheList = verifyProof(proof, name, bytesToHex(new Uint8Array(root_bytes_data)))
  if(isInTheList) {
    res.send("You got a toy robot!");
  }
  else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
