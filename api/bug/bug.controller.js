import { loggerService } from "../../services/logger.service.js";
import { bugService } from "./bug.service.js";

export const bugController = {
  getBugs,
  getBug,
  addBug,
  updateBug,
  removeBug,
};

const VISITED_BUGS_LIMIT = 3;

async function getBugs(req, res) {
  const filterBy = {};

  try {
    const bugs = await bugService.query(filterBy);
    res.status(200).send(bugs);
    console.log({ bugs });
  } catch (err) {
    loggerService.error(`Couldn't get bugs`, err);
    res.status(500).send(`Couldn't get bugs`);
  }
}

async function getBug(req, res) {
  const { bugId } = req.params;
  const visitedBugs = req.cookies.visitedBugs || [];
  //   if (visitedBugs.length >= 3) {
  //     return res.status(401).send("no no no");
  //   }
  try {
    const bug = await bugService.getById(bugId);
    res.status(200).send(bug);
  } catch (err) {
    loggerService.error(`Couldn't get bug ${bugId}`, err);
    res.status(500).send(`Couldn't get bug ${bugId}`);
  }
}

async function addBug(req, res) {
  const { title, description, severity, labels } = req.body;
  const bugToSave = {
    title,
    description,
    severity: +severity,
    createdAt: Date.now(),
    labels,
  };

  try {
    const savedBug = await bugService.save(bugToSave);
    res.status(201).send(savedBug);
  } catch (err) {
    loggerService.error(`Couldn't save bug`, err);
    res.status(400).send(`Couldn't save bug`);
  }
}

async function updateBug(req, res) {
  const { _id, title, description, severity, createdAt, labels } = req.body;
  const bugToSave = {
    _id,
    title,
    description,
    severity: +severity,
    createdAt,
    labels,
  };

  try {
    const savedBug = await bugService.save(bugToSave);
    res.status(201).send(savedBug);
  } catch (err) {
    loggerService.error(`Couldn't save bug`, err);
    res.status(400).send(`Couldn't save bug`);
  }
}

async function removeBug(req, res) {
  const { bugId } = req.params;
  try {
    await bugService.remove(bugId);
    res.send("OK");
  } catch (err) {
    loggerService.error(`Couldn't remove bug ${bugId}`, err);
    res.status(400).send(`Couldn't remove bug ${bugId}`);
  }
}
