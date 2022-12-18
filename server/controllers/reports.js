import asyncHandler from "express-async-handler";

import ProjectModal from "../modals/project.js";
import ProfileModal from "../modals/profile.js";

// Access: Private
// Method: POST
// route: /reports/profiles_summary/:year
export const getProfilesSummary = asyncHandler(async (req, res) => {
  const year = parseInt(req.params.year);
  const user = req.user;
  if (isNaN(year)) throw new Error("Not a valid year");

  try {
    var filter = {};
    if (user.role === "user") filter = { bidder: user._id };

    let closed = await ProjectModal.aggregate([
      {
        $lookup: {
          from: "profiles",
          localField: "profile",
          foreignField: "_id",
          as: "profile",
        },
      },
      {
        $lookup: {
          from: "milestones",
          localField: "_id",
          foreignField: "project",
          as: "milestone",
        },
      },
      { $unwind: "$milestone" },
      { $match: { "milestone.status": "paid" } },
      {
        $addFields: {
          year: { $year: "$milestone.paymentDate" },
          month: { $month: "$milestone.paymentDate" },
          profile: { $arrayElemAt: ["$profile", 0] },
        },
      },
      { $match: { year: year } },

      {
        $group: {
          _id: {
            month: "$month",
            profile: "$profile.title",
            platform: "$profile.platform",
          },
          count: { $sum: 1 },
          amountRecieved: {
            $sum: "$milestone.amountRecieved",
          },
          empShare: {
            $sum: "$milestone.employeeShare",
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          profile: "$_id.profile",
          platform: "$_id.platform",
          amountRecieved: "$amountRecieved",
          empShare: "$empShare",
          count: "$count",
        },
      },
      {
        $group: {
          _id: {
            profile: "$profile",
            platform: "$platform",
          },
          count: { $sum: "$count" },
          amountRecieved: {
            $sum: "$amountRecieved",
          },
          empShare: {
            $sum: "$empShare",
          },
          projects: {
            $push: {
              month: "$month",
              projects: "$projects",
              amountRecieved: "$amountRecieved",
              empShare: "$empShare",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          profile: "$_id.profile",
          platform: "$_id.platform",
          totalCount: "$count",
          totalAmount: "$amountRecieved",
          totalEmpShare: "$empShare",
          projects: "$projects",
        },
      },
    ]);

    let pending = await ProjectModal.aggregate([
      {
        $lookup: {
          from: "profiles",
          localField: "profile",
          foreignField: "_id",
          as: "profile",
        },
      },
      {
        $lookup: {
          from: "milestones",
          localField: "_id",
          foreignField: "project",
          as: "milestone",
        },
      },
      { $unwind: "$milestone" },
      { $match: { "milestone.status": "unpaid" } },
      {
        $addFields: {
          year: { $year: "$milestone.paymentDate" },
          profile: { $arrayElemAt: ["$profile", 0] },
        },
      },
      { $match: { year: year } },
      {
        $group: {
          _id: {
            profile: "$profile.title",
            platform: "$profile.platform",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          profile: "$_id.profile",
          platform: "$_id.platform",
          total: "$count",
        },
      },
    ]);

    let cancelled = await ProjectModal.aggregate([
      {
        $lookup: {
          from: "profiles",
          localField: "profile",
          foreignField: "_id",
          as: "profile",
        },
      },
      {
        $lookup: {
          from: "milestones",
          localField: "_id",
          foreignField: "project",
          as: "milestone",
        },
      },
      { $unwind: "$milestone" },
      { $match: { "milestone.status": "cancelled" } },
      {
        $addFields: {
          year: { $year: "$milestone.paymentDate" },
          profile: { $arrayElemAt: ["$profile", 0] },
        },
      },
      { $match: { year: year } },
      {
        $group: {
          _id: {
            profile: "$profile.title",
            platform: "$profile.platform",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          profile: "$_id.profile",
          platform: "$_id.platform",
          total: "$count",
        },
      },
    ]);

    // combind above 4 results into one
    const profiles = await ProfileModal.find(filter).select(
      "title platform -_id"
    );
    const profilesSummary = profiles.map((p) => {
      let temp = {
        profile: `${p.title} ${p.platform}`,
        closedTotal: 0,
        closedSummary: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        cashRecievedTotal: 0,
        cashRecievedSummary: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        empShareTotal: 0,
        empShareSummary: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        pendingTotal: 0,
        cancelledTotal: 0,
      };
      const tempClosed = closed.find(
        (project) =>
          project.profile === p.title && project.platform === p.platform
      );
      if (tempClosed) {
        temp.cashRecievedTotal = tempClosed.totalAmount;
        temp.closedTotal = tempClosed.totalCount;
        temp.empShareTotal = tempClosed.totalEmpShare;

        tempClosed.projects.map((s) => {
          temp.cashRecievedSummary[s.month - 1] = s.amountRecieved;
          temp.closedSummary[s.month - 1] = s.count;
          temp.empShareSummary[s.month - 1] = s.empShare;
        });
      }
      const tempPending = pending.find(
        (project) =>
          project.profile === p.title && project.platform === p.platform
      );
      if (tempPending) {
        temp.pendingTotal = tempPending.total;
      }
      const tempCancelled = cancelled.find(
        (project) =>
          project.profile === p.title && project.platform === p.platform
      );
      if (tempCancelled) {
        temp.cancelledTotal = tempCancelled.total;
      }

      if (tempClosed || tempCancelled || tempPending) return temp;
    });

    res.status(200).json(profilesSummary);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
