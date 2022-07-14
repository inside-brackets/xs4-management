import asyncHandler from "express-async-handler";

import ProfileModal from "../modals/profile.js";

// Access: Private
// Method: POST
// route: /reports/profiles_summary/:year
export const getProfilesSummary = asyncHandler(async (req, res) => {
  try {
    let profiles = await ProfileModal.aggregate([
      {
        $lookup: {
          from: "Projects",
          localField: "_id",
          foreignField: "profile",
          as: "projects",
        },
      },
      //   { $addFields: { yearAwarded: { $year: "$awardedAt" } } },
      //   { $addFields: { yearClosed: { $year: "$closedAt" } } },
      //   { $addFields: { yearCreated: { $year: "$createdAt" } } },
      //   { $addFields: { yearUpdated: { $year: "$updateddAt" } } },
    ]);

    res.status(200).json(profiles);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
