import mongoose from "mongoose";
import Log from "../modals/log.js";
import User from "../modals/user.js";

export const createLog = async (req, res) => {
  try {
    const { user, project, description } = req.body;
    let log = await Log.create({
      user,
      project,
      description
    });

    log = await Log.findById(log._id).populate({
      path: "project",
      select: { title: 1, profile: 1 }
    });
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
      select: { title: 1, profile: 1 }
    });

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

    const filter = { createdAt: { $gte: today } };
    if (req.query[0] !== "{}") {
      const filt = JSON.parse(req.query[0]);
      if (filt["user"]?.length > 0) {
        filter.user = {
          $in: filt?.user.map(item => mongoose.Types.ObjectId(item))
        };
      }
      if (filt["projects"]?.length > 0) {
        filter.project = {
          $in: filt?.projects?.map(item => mongoose.Types.ObjectId(item))
        };
      }
    }
    let logs = await Log.find(filter)
      .populate({
        path: "project",
        select: { title: 1, profile: 1 }
      })
      .populate({ path: "user", select: { userName: 1 } });

    res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateLog = async (req, res) => {
  try {
    const { id, project, description } = req.body;
    let log = await Log.findByIdAndUpdate(
      id,
      {
        project,
        description
      },
      {
        new: true
      }
    ).populate({
      path: "project",
      select: { title: 1, profile: 1 }
    });

    res.status(200).json(log);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getUserDontHaveLogs = async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const logs = await User.aggregate([
      // Find all user documents
      {
        $match: {}
      },
      // Left join with project log documents created today
      {
        $lookup: {
          from: "logs",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", "$$userId"] },
                    { $gte: ["$createdAt", today] }
                  ]
                }
              }
            }
          ],
          as: "logsToday"
        }
      },
      // Filter to only include users without project logs created today
      {
        $match: {
          logsToday: { $size: 0 }
        }
      },
      // Project only the fields you need
      {
        $project: {
          _id: 1,
          userName: 1,
          firstName: 1,
          lastName: 1
        }
      }
    ]).exec();

    res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
