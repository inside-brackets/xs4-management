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

    let awardedProjects = await ProjectModal.aggregate([
      {
        $lookup: {
          from: "profiles",
          localField: "profile",
          foreignField: "_id",
          as: "profile",
        },
      },
      {
        $addFields: {
          year: { $year: "$awardedAt" },
          month: { $month: "$awardedAt" },
          profile: { $arrayElemAt: ["$profile", 0] },
        },
      },
      { $match: { year: year } },
      {
        $group: {
          _id: {
            month: "$month",
            profile: "$profile.title",
            status: "$status",
          },
          count: {
            $sum: 1,
          },
          totalAmount: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          profile: "$_id.profile",
          status: "$_id.status",
          count: "$count",
          totalAmount: "$totalAmount",
        },
      },
      {
        $group: {
          _id: {
            profile: "$profile",
            month: "$month",
          },
          count: {
            $sum: "$count",
          },
          totalAmount: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $project: {
          _id: 0,
          profile: "$_id.profile",
          month: "$_id.month",
          count: "$count",
          totalAmount: "$totalAmount",
        },
      },
      {
        $group: {
          _id: {
            profile: "$profile",
          },
          count: {
            $sum: "$count",
          },
          totalAmount: {
            $sum: "$totalAmount",
          },
          projects: {
            $push: {
              month: "$month",
              count: "$count",
              projects: "$projects",
              totalAmount: "$totalAmount",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          profile: "$_id.profile",
          total: "$count",
          projects: "$projects",
        },
      },
    ]);

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
        $addFields: {
          year: { $year: "$closedAt" },
          month: { $month: "$closedAt" },
          profile: { $arrayElemAt: ["$profile", 0] },
        },
      },
      { $match: { year: year, status: "closed" } },
      {
        $group: {
          _id: {
            month: "$month",
            profile: "$profile.title",
          },

          amountRecieved: {
            $sum: "$amountRecieved",
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          profile: "$_id.profile",
          amountRecieved: "$amountRecieved",
        },
      },
      {
        $group: {
          _id: {
            profile: "$profile",
          },

          amountRecieved: {
            $sum: "$amountRecieved",
          },
          projects: {
            $push: {
              month: "$month",
              projects: "$projects",
              amountRecieved: "$amountRecieved",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          profile: "$_id.profile",
          total: "$amountRecieved",
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
        $addFields: {
          year: { $year: "$createdAt" },
          profile: { $arrayElemAt: ["$profile", 0] },
        },
      },
      { $match: { year: year, status: { $nin: ["closed", "cancelled"] } } },
      {
        $group: {
          _id: {
            profile: "$profile.title",
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
        $addFields: {
          year: { $year: "$createdAt" },
          profile: { $arrayElemAt: ["$profile", 0] },
        },
      },
      { $match: { year: year, status: "cancelled" } },
      {
        $group: {
          _id: {
            profile: "$profile.title",
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
          total: "$count",
        },
      },
    ]);

    // combind above 4 results into one
    const profiles = await ProfileModal.find(filter).select("title -_id");
    const profilesSummary = profiles.map((p) => {
      let temp = {
        profile: p.title,
        awardedTotal: 0,
        awardedSummary: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        cashRecievedTotal: 0,
        cashRecievedSummary: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        pendingTotal: 0,
        cancelledTotal: 0,
      };
      const tempAwarded = awardedProjects.find(
        (project) => project.profile === p.title
      );
      if (tempAwarded) {
        temp.awardedTotal = tempAwarded.total;
        tempAwarded.projects.map(
          (s) => (temp.awardedSummary[s.month - 1] = s.count)
        );
      }
      const tempClosed = closed.find((project) => project.profile === p.title);
      if (tempClosed) {
        temp.cashRecievedTotal = tempClosed.total;
        tempClosed.projects.map(
          (s) => (temp.cashRecievedSummary[s.month - 1] = s.amountRecieved)
        );
      }
      const tempPending = pending.find(
        (project) => project.profile === p.title
      );
      if (tempPending) {
        temp.pendingTotal = tempPending.total;
      }
      const tempCancelled = cancelled.find(
        (project) => project.profile === p.title
      );
      if (tempCancelled) {
        temp.cancelledTotal = tempCancelled.total;
      }

      if (tempAwarded || tempClosed || tempCancelled || tempPending)
        return temp;
    });

    const cleanedProfileSumaries = profilesSummary.filter((n) => n);

    res.status(200).json(cleanedProfileSumaries);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
