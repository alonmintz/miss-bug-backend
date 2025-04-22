import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js";

const bugs = readJsonFile("./data/bugs.json");
const BUGS_PER_PAGE = 3;

export const bugService = {
  query,
  getById,
  remove,
  save,
};

async function query(filterBy) {
  let bugsToDisplay = bugs;
  try {
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, "i");
      bugsToDisplay = bugsToDisplay.filter((bug) => regExp.test(bug.title));
    }

    if (filterBy.minSeverity) {
      bugsToDisplay = bugsToDisplay.filter(
        (bug) => bug.severity >= filterBy.minSeverity
      );
    }

    if (filterBy.labels && filterBy.labels.length > 0) {
      bugsToDisplay = bugsToDisplay.filter((bug) => {
        const labels = bug.labels;
        if (!labels || !labels.length) return false;
        return labels.some((label) => filterBy.labels.includes(label));
      });
    }

    if (filterBy.sortBy) {
      const { sortBy, sortDir } = filterBy;
      bugsToDisplay = bugsToDisplay.sort((bug1, bug2) => {
        switch (sortBy) {
          case "title":
            return bug1.title.localeCompare(bug2.title) * sortDir;
          case "severity":
            return (bug1.severity - bug2.severity) * sortDir;
          case "createdAt":
            return (bug1.createdAt - bug2.createdAt) * sortDir;
          default:
            break;
        }
      });
    }
    console.log("out: ", filterBy.pageIdx);

    if (filterBy.pageIdx >= 0) {
      console.log("here: ", filterBy.pageIdx);
      const startIdx = filterBy.pageIdx * BUGS_PER_PAGE;
      bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + BUGS_PER_PAGE);
    }

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
