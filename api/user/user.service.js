import { loggerService } from "../../services/logger.service.js";
import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js";

const users = readJsonFile("./data/users.json");

export const userService = {
  query,
  getById,
  remove,
  save,
  getByUsername,
};

async function query(filterBy) {
  let usersToDisplay = users;
  try {
    //todo: implement filterBy logic if necessary
    // if (filterBy.txt) {
    //   const regExp = new RegExp(filterBy.txt, "i");
    //   usersToDisplay = usersToDisplay.filter((user) => regExp.test(user.title));
    // }

    // if (filterBy.minSeverity) {
    //   usersToDisplay = usersToDisplay.filter(
    //     (user) => user.severity >= filterBy.minSeverity
    //   );
    // }

    // if (filterBy.labels && filterBy.labels.length > 0) {
    //   usersToDisplay = usersToDisplay.filter((user) => {
    //     const labels = user.labels;
    //     if (!labels || !labels.length) return false;
    //     return labels.some((label) => filterBy.labels.includes(label));
    //   });
    // }

    // if (filterBy.sortBy) {
    //   const { sortBy, sortDir } = filterBy;
    //   usersToDisplay = usersToDisplay.sort((user1, user2) => {
    //     switch (sortBy) {
    //       case "title":
    //         return user1.title.localeCompare(user2.title) * sortDir;
    //       case "severity":
    //         return (user1.severity - user2.severity) * sortDir;
    //       case "createdAt":
    //         return (user1.createdAt - user2.createdAt) * sortDir;
    //       default:
    //         break;
    //     }
    //   });
    // }

    // if (filterBy.pageIdx >= 0) {
    //   const startIdx = filterBy.pageIdx * USERS_PER_PAGE;
    //   usersToDisplay = usersToDisplay.slice(startIdx, startIdx + USERS_PER_PAGE);
    // }

    return usersToDisplay;
  } catch (err) {
    loggerService.error("userService[query] : ", err);
    throw err;
  }
}

async function getById(userId) {
  try {
    const user = users.find((user) => user._id === userId);
    if (!user) throw new Error("Cannot find user");
    return user;
  } catch (err) {
    loggerService.error("userService[getById] : ", err);
    throw err;
  }
}

async function getByUsername(username) {
  try {
    const user = users.find((user) => user.username === username);
    // if (!user) throw `User not found by username : ${username}`
    return user;
  } catch (err) {
    loggerService.error("userService[getByUsername] : ", err);
    throw err;
  }
}

async function remove(userId) {
  try {
    const userIdx = users.findIndex((user) => user._id === userId);
    if (userIdx === -1) throw new Error("Cannot find user");
    users.splice(userIdx, 1);
    await _saveUsersToFile();
  } catch (err) {
    loggerService.error("userService[remove] : ", err);
    throw err;
  }
}

async function save(userToSave) {
  try {
    if (userToSave._id) {
      const userIdx = users.findIndex((user) => user._id === userToSave._id);
      if (userIdx === -1) throw new Error("Cannot find user");
      users[userIdx] = userToSave;
    } else {
      userToSave._id = makeId();
      users.unshift(userToSave);
    }
    await _saveUsersToFile();
    return userToSave;
  } catch (err) {
    loggerService.error("userService[save] : ", err);
    throw err;
  }
}

function _saveUsersToFile() {
  return writeJsonFile("./data/users.json", users);
}
