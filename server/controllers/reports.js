import asyncHandler from "express-async-handler";
import MilestoneModal from "../modals/milestone.js";
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
    //  if (user.role === "user") filter = { bidder: user._id };

    // let awardedProjects = await MilestoneModal.aggregate([
    //   {
    //     $lookup: {
    //       from: "profiles",
    //       localField: "profile",
    //       foreignField: "_id",
    //       as: "profile",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       year: { $year: "$paymentDate" },
    //       month: { $month: "$paymentDate" },
    //       profile: { $arrayElemAt: ["$profile", 0] },
    //     },
    //   },
    //   { $match: { year: year } },
    //   {
    //     $group: {
    //       _id: {
    //         month: "$month",
    //         profile: "$profile.title",
    //         status: "$status",
    //       },
    //       count: {
    //         $sum: 1,
    //       },
    //       totalAmount: {
    //         $sum: "$totalAmount",
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       month: "$_id.month",
    //       profile: "$_id.profile",
    //       status: "$_id.status",
    //       count: "$count",
    //       totalAmount: "$totalAmount",
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         profile: "$profile",
    //         month: "$month",
    //       },
    //       count: {
    //         $sum: "$count",
    //       },
    //       totalAmount: {
    //         $sum: "$totalAmount",
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       profile: "$_id.profile",
    //       month: "$_id.month",
    //       count: "$count",
    //       totalAmount: "$totalAmount",
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         profile: "$profile",
    //       },
    //       count: {
    //         $sum: "$count",
    //       },
    //       totalAmount: {
    //         $sum: "$totalAmount",
    //       },
    //       projects: {
    //         $push: {
    //           month: "$month",
    //           count: "$count",
    //           milestone: "$milestones",
    //           totalAmount: "$totalAmount",
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       profile: "$_id.profile",
    //       total: "$count",
    //       milestone: "$milestones",
    //     },
    //   },
    // ]);

    let paid = await MilestoneModal.aggregate([
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "profile",
        },
      },
      {
        $addFields: {
          year: { $year: "$paymentDate" },
          month: { $month: "$paymentDate" },
          profile: { $arrayElemAt: ["$profile", 0] },
        },
      },
      { $match: { year: year, status: "paid" } },
      {
        $group: {
          _id: {
            month: "$month",
            profile: "$profile.title",
            platform: "$profile.platform",
          },
          count: { $sum: 1 },
          amountRecieved: {
            $sum: "$amountRecieved",
          },
          employeeShare: {
            $sum: "$employeeShare",
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
          employeeShare: "$employeeShare",
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
          employeeShare: {
            $sum: "$employeeShare",
          },
          milestones: {
            $push: {
              month: "$month",
              milestones: "$milestones",
              amountRecieved: "$amountRecieved",
              employeeShare: "$employeeShare",
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
          milestone: "$milestones",
        },
      },
    ]);

    let unpaid = await MilestoneModal.aggregate([
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
      { $match: { year: year, status: { $nin: ["paid", "cancelled"] } } },
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

    let cancelled = await MilestoneModal.aggregate([
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
      const tempClosed = paid.find(
        (milestone) =>
          milestone.profile === p.title && milestone.platform === p.platform
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
      const tempPending = unpaid.find(
        (milestone) =>
          milestone.profile === p.title && milestone.platform === p.platform
      );
      if (tempPending) {
        temp.pendingTotal = tempPending.total;
      }
      const tempCancelled = cancelled.find(
        (milestone) =>
          milestone.profile === p.title && milestone.platform === p.platform
      );
      if (tempCancelled) {
        temp.cancelledTotal = tempCancelled.total;
      }

      if (tempClosed || tempCancelled || tempPending) return temp;
    });

    const cleanedProfileSumaries = profilesSummary.filter((n) => n);

    res.status(200).json(cleanedProfileSumaries);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
