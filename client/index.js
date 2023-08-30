// Brooke's version of this
// Each time this is run it generates 2 names.  1 is in the niceList and the other isn't.
// I chose to do it this way rather than have a CLI input of a name, to simplify things.

const axios = require('axios');
const niceList = require('../utils/niceList.json');

const serverUrl = 'http://localhost:1225';

const getSomeNames = () => {
  const indexInNameList = () => Math.floor(Math.random() * niceList.length);

  const nameInList = niceList[indexInNameList()];
  const nameNotInListFirstPart = niceList[indexInNameList()].split(' ')[0];
  const nameNotInListSecondPart = niceList[indexInNameList()].split(' ')[0];
  const nameNotInList = `${nameNotInListFirstPart} ${nameNotInListSecondPart}`
  // console.log(`nameInList: ${nameInList}, nameNotInList: ${nameNotInList}`)
  return {nameInList, nameNotInList}
}

async function main() {
  const { nameInList, nameNotInList } = getSomeNames();
  const yesNameInListGift = await checkForGift(nameInList)
  const noNameNotInListGift = await checkForGift(nameNotInList)
  console.log(`"${nameInList}, ${yesNameInListGift}"`)
  console.log(`"${nameNotInList}, ${noNameNotInListGift}"`)
}

checkForGift = async (name) => {
  try {
    const { data: gift } = await axios.post(`${serverUrl}/gift`, {
      name
    });
    return gift;
  } catch (e) {
    console.log(`Exception: ${e.response.status} - "${e.response.data}"`)
  }
}

main();
