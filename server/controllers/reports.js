import asyncHandler from "express-async-handler";

import ProjectModal from "../modals/project.js";

// Access: Private
// Method: POST
// route: /reports/profiles_summary/:year
export const getProfilesSummary = asyncHandler(async (req, res) => {
  const year = parseInt(req.params.year);
  try {
    let AwardedProfiles = await ProjectModal.aggregate([
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
          month: { $month: "$createdAt" },
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
          awardedCount: "$count",
          AwardedProjects: "$projects",
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
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
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
          cloasedCount: "$count",
          cloasedProjects: "$projects",
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
          count: "$count",
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
          count: "$count",
        },
      },
    ]);
    // [
    //   {
    //     profile: "title",
    //     adardedTotal: 10,
    //     awardedSummary: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10],
    //     cashRecievedTotal: 100,
    //     cashRecievedSummary: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10],
    //     pendingTotal:2,
    //     cancelledTotal: 2
    //   },
    // ];
    // combind above 4 results into one

    res.status(200).json(cancelled);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
