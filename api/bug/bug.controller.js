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
  const {
    txt,
    minSeverity,
    labels,
    sortBy,
    sortDir = "1",
    pageIdx,
  } = req.query;
  const filterBy = {
    txt,
    minSeverity,
    labels,
    sortBy,
    sortDir: +sortDir,
    pageIdx: +pageIdx,
  };

  try {
    const bugs = await bugService.query(filterBy);
    res.status(200).send(bugs);
  } catch (err) {
    loggerService.error(`Couldn't get bugs`, err);
    res.status(500).send(`Couldn't get bugs`);
  }
}

async function getBug(req, res) {
  const { bugId } = req.params;
  try {
    const visitedBugIds = req.cookies.visitedBugIds || [];
    if (!visitedBugIds.includes(bugId)) visitedBugIds.push(bugId);
    if (visitedBugIds.length > VISITED_BUGS_LIMIT)
      return res.status(403).send("no no no");

    const bug = await bugService.getById(bugId);
    res.cookie("visitedBugIds", visitedBugIds, { maxAge: 1000 * 7 });
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
