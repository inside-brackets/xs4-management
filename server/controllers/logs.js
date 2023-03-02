import Log from "../modals/log.js";

export const createLog = async (req, res) => {
  try {
    const { user, project, description } = req.body;
    let log = await Log.create({
      user,
      project,
      description,
    }).populate({
      path: "project",
      select: { title: 1, profile: 1 },
    });
    log = await log
      .populate({
        path: "project.profile",
        select: { title: 1, platform: 1 },
      })
      .execPopulate();

    res.status(200).json(log);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getLogs = async (req, res) => {
  try {
    const { user } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let logs = await Log.find({ user, createdAt: { $gte: today } }).populate({
      path: "project",
      select: { title: 1, profile: 1 },
    });
    logs = await logs
      .populate({
        path: "project.profile",
        select: { title: 1, platform: 1 },
      })
      .execPopulate();

    res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getAllLogs = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let logs = await Log.find({ createdAt: { $gte: today } }).populate({
      path: "project",
      select: { title: 1, profile: 1 },
    });
    logs = await logs
      .populate({
        path: "project.profile",
        select: { title: 1, platform: 1 },
      })
      .execPopulate();

    res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateLog = async (req, res) => {
  try {
    const { id, project, description } = req.body;
    let log = await Log.findByIdAndUpdate(id, {
      project,
      description,
    }).populate({
      path: "project",
      select: { title: 1, profile: 1 },
    });
    log = await log
      .populate({
        path: "project.profile",
        select: { title: 1, platform: 1 },
      })
      .execPopulate();

    res.status(200).json(log);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
