import ProjectModal from "../modals/project.js";
import asyncHandler from "express-async-handler";

export const migrateMilestones = asyncHandler(async (req, res) => {
  try {
    const milestones = await ProjectModal.aggregate({
      $project: {
        project: "$_id",
      },
    });
    res.json(milestones);
  } catch (error) {
    console.log(error);
  }
  // if milestones
  // calculate net recieveable and amt deducted
  // createmany milestones
});
