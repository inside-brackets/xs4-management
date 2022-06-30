import asyncHandler from "express-async-handler";

import ProjectModal from "../modals/project.js";

// Access: Private
// Method: POST
// route: /projects
export const createProject = asyncHandler(async (req, res) => {
  try {
    let createdProject = await ProjectModal.create(req.body);

    res.status(201);

    res.json(createdProject);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route: /projects/:id
export const getProject = asyncHandler(async (req, res) => {
  try {
    let project = await ProjectModal.findById(req.params.id);

    res.status(200);

    res.json(project);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: PUT
// route: /projects/:id
export const updateProject = asyncHandler(async (req, res) => {
  try {
    let updatedProjects = await ProjectModal.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, upsert: true }
    );

    res.status(200);

    res.json(updatedProjects);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Admin
// Method: DELETE
// route: /projects/:id
export const deleteProject = asyncHandler(async (req, res) => {
  try {
    // delete project
    res.json({ msh: "comming soon" });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route: /projects/:limit/:offset
export const listProjects = asyncHandler(async (req, res) => {
  try {
    console.log("listProjects", req.params.offset);
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);
    const {
      search,
      profile,
      assignee,
      projectType,
      hasRecruiter,
      status,
      totalAmount__gte,
      totalAmount__lt,
      awardedAt__gte,
      awardedAt__lt,
      closedAt__gte,
      closedAt__lt,
      deadlineAt__gte,
      deadlineAt__lt,
    } = req.body;
    let filter = {};

    if (search) {
      filter["$or"] = [
        { title: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
        { recruiterName: { $regex: search, $options: "i" } },
      ];
    }
    if (profile) {
      filter.profile = { $in: profile };
    }
    if (assignee) {
      filter.assignee = { $in: assignee };
    }
    if (projectType) {
      filter.projectType = { $in: projectType };
    }
    if (hasRecruiter) {
      filter.hasRecruiter = hasRecruiter;
    }
    if (status) {
      filter.status = { $in: status };
    }
    if (totalAmount__gte && totalAmount__lt) {
      filter.totalAmount = { $gte: totalAmount__gte, $lt: totalAmount__lt };
    }
    if (awardedAt__gte && awardedAt__lt) {
      filter.awardedAt = {
        $gte: new Date(awardedAt__gte),
        $lt: new Date(awardedAt__lt),
      };
    }
    if (closedAt__gte && closedAt__lt) {
      filter.closedAt = {
        $gte: new Date(closedAt__gte),
        $lt: new Date(closedAt__lt),
      };
    }
    if (deadlineAt__gte && deadlineAt__lt) {
      filter.deadlineAt = {
        $gte: new Date(deadlineAt__gte),
        $lt: new Date(deadlineAt__lt),
      };
    }

    const projects = await ProjectModal.find(filter)
      .populate("assignee profile")
      .sort({ awardedAt: -1 })
      .limit(limit)
      .skip(offset);

    const totalProjects = await ProjectModal.find(filter);

    res.status(200).json({ projects, total: totalProjects.length });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
