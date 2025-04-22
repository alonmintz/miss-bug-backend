import { loggerService } from "../../services/logger.service.js";
import { userService } from "./user.service.js";

export const userController = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  removeUser,
};

async function getUsers(req, res) {
  const filterBy = {
    //todo: implement if necessary
  };

  try {
    const users = await userService.query(filterBy);
    res.status(200).send(users);
  } catch (err) {
    loggerService.error(`Couldn't get users`, err);
    res.status(500).send(`Couldn't get users`);
  }
}

async function getUser(req, res) {
  const { userId } = req.params;
  try {
    const user = await userService.getById(userId);
    res.status(200).send(user);
  } catch (err) {
    loggerService.error(`Couldn't get user ${userId}`, err);
    res.status(500).send(`Couldn't get user ${userId}`);
  }
}

async function addUser(req, res) {
  const { fullname, username, password, isAdmin, score, imgUrl } = req.body;
  const userToSave = {
    fullname,
    username,
    password,
    isAdmin,
    score,
    imgUrl,
  };

  try {
    const savedUser = await userService.save(userToSave);
    res.status(201).send(savedUser);
  } catch (err) {
    loggerService.error(`Couldn't save user`, err);
    res.status(400).send(`Couldn't save user`);
  }
}

async function updateUser(req, res) {
  const { _id, fullname, username, password, isAdmin, score, imgUrl } =
    req.body;
  const userToSave = {
    _id,
    fullname,
    username,
    password,
    isAdmin,
    score,
    imgUrl,
  };

  try {
    const savedUser = await userService.save(userToSave);
    res.status(201).send(savedUser);
  } catch (err) {
    loggerService.error(`Couldn't save user`, err);
    res.status(400).send(`Couldn't save user`);
  }
}

async function removeUser(req, res) {
  const { userId } = req.params;
  try {
    await userService.remove(userId);
    res.send("OK");
  } catch (err) {
    loggerService.error(`Couldn't remove user ${userId}`, err);
    res.status(400).send(`Couldn't remove user ${userId}`);
  }
}
