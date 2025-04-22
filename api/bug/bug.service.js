import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js";

const bugs = readJsonFile("./data/bugs.json");

export const bugService = {
  query,
  getById,
  remove,
  save,
};

async function query(filterBy) {
  let bugsToDisplay = bugs;
  try {
    //TODO: add filtering
    // if (filterBy.txt) {
    //   const regExp = new RegExp(filterBy.txt, "i");
    //   bugsToDisplay = bugsToDisplay.filter((bug) => regExp.test(bug.vendor));
    // }

    // if (filterBy.minSpeed) {
    //   bugsToDisplay = bugsToDisplay.filter(
    //     (bug) => bug.speed >= filterBy.minSpeed
    //   );
    // }

    // if (filterBy.maxPrice) {
    //   bugsToDisplay = bugsToDisplay.filter(
    //     (bug) => bug.price <= filterBy.maxPrice
    //   );
    // }
    return bugsToDisplay;
  } catch (err) {
    throw err;
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId);
    if (!bug) throw new Error("Cannot find bug");
    return bug;
  } catch (err) {
    throw err;
  }
}

async function remove(bugId) {
  try {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugId);
    if (bugIdx === -1) throw new Error("Cannot find bug");
    bugs.splice(bugIdx, 1);
    await _saveBugsToFile();
  } catch (err) {
    console.log("err:", err);
    throw err;
  }
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const bugIdx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (bugIdx === -1) throw new Error("Cannot find bug");
      bugs[bugIdx] = bugToSave;
    } else {
      bugToSave._id = makeId();
      bugs.unshift(bugToSave);
    }
    await _saveBugsToFile();
    return bugToSave;
  } catch (err) {
    throw err;
  }
}

function _saveBugsToFile() {
  return writeJsonFile("./data/bugs.json", bugs);
}
