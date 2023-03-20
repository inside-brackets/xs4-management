import asyncHandler from "express-async-handler";

import ProjectModal from "../modals/project.js";
import ProfileModal from "../modals/profile.js";
import { response } from "express";
import mongoose from "mongoose";

// Access: Private
// Method: POST
// route: /projects
export const createProject = asyncHandler(async (req, res) => {
  try {
    let createdProject = await ProjectModal.create(req.body);

    res.status(201);

    res.json(createdProject);
  } catch (error) {
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route: /projects/:id
export const getProject = asyncHandler(async (req, res) => {
  try {
    let project = await ProjectModal.findById(req.params.id).populate(
      "assignee profile"
    );
    console.log(project);
    res.status(200).json(project);
  } catch (error) {
    throw new Error(error.message);
  }
});

export const getAllProjects = asyncHandler(async (req, res) => {
  try {
    if (req.query.assignee)
      req.query.assignee = {
        $in: req?.query?.assignee?.map(item => mongoose.Types.ObjectId(item))
      };
    if (req.query.status) req.query.status = JSON.parse(req.query?.status);
    let getAllProjects = await ProjectModal.find(req.query);
    res.status(200);

    res.json(getAllProjects);
  } catch (error) {
    throw new Error(error.message);
  }
});

// Access: Private
// Method: PUT
// route: /projects/:id
export const updateProject = asyncHandler(async (req, res) => {
  try {
    // if (req.body.files) {
    //   let updatedProjects = await ProjectModal.findOneAndUpdate(
    //     { _id: req.params.id },
    //     { $push: { files: req.body.files } },
    //     { new: true, upsert: true }
    //   );
    //   res.status(200);
    //   res.json(updatedProjects);
    // } else {
    let updatedProjects = await ProjectModal.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedProjects);
    // }
  } catch (error) {
    throw new Error(error.message);
  }
});

// Access: Private
// Method: PUT
// route: /projects/:id
export const deleteFile = asyncHandler(async (req, res) => {
  try {
    let deleteFile = await ProjectModal.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.status(200);
    res.json(deleteFile);
  } catch (error) {
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
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route: /projects/:limit/:offset
export const listProjects = asyncHandler(async (req, res) => {
  try {
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);
    const {
      search,
      profile,
      assignment,
      assignee,
      projectType,
      hasRecruiter,
      status,
      totalAmount__gte,
      totalAmount__lte,
      closedAt__gte,
      closedAt__lte,
      platform,
      bidder,
      custom,
      sort
    } = req.body;
    let filter = custom ?? {};
    filter["$and"] = filter["$and"] ?? [];
    let profiles = [];

    if (search) {
      filter["$and"] = [
        ...filter["$and"],
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { clientName: { $regex: search, $options: "i" } }
          ]
        }
      ];
    }

    if (assignee && assignee.length !== 0) {
      filter.assignee = { $in: assignee };
    }
    if (projectType && projectType.length !== 0) {
      filter.projectType = { $in: projectType };
    }

    if (platform && platform.length !== 0) {
      profiles = await ProfileModal.find({
        platform: { $in: platform }
      });
      filter.profile = { $in: profiles };
    }
    if (bidder && bidder.length !== 0) {
      if (profiles.length !== 0) {
        profiles = await ProfileModal.find({
          _id: { $in: profiles },
          bidder: { $in: bidder }
        });
      } else {
        profiles = await ProfileModal.find({
          bidder: { $in: bidder }
        });
      }

      filter.profile = { $in: profiles };
    }
    if (profile && profile.length !== 0) {
      filter.profile = { $in: [...profile, ...profiles] };
    }
    if (hasRecruiter) {
      filter.hasRecruiter = hasRecruiter;
    }
    if (status && status.length !== 0) {
      filter.status = { $in: status };
    }
    if (totalAmount__gte && totalAmount__lte) {
      filter.totalAmount = { $gte: totalAmount__gte, $lte: totalAmount__lt };
    }

    if (closedAt__gte && closedAt__lte) {
      // filter.closedAt = {
      //   $exists: true,
      //   $gte: new Date(closedAt__gte),
      //   $lte: new Date(closedAt__lte),
      // };
      filter["$and"] = [
        ...filter["$and"],
        {
          $or: [
            {
              awardedAt: {
                $gte: new Date(closedAt__gte),
                $lte: new Date(closedAt__lte)
              }
            },
            {
              closedAt: {
                $exists: true,
                $gte: new Date(closedAt__gte),
                $lte: new Date(closedAt__lte)
              }
            }
          ]
        }
      ];
    }

    let sortResult = {};
    if (sort.length > 0) {
      sort.forEach((value, index) => {
        sortResult[value] = -1;
      });
    } else {
      sortResult = {
        updatedAt: -1
      };
    }

    const user = req.user;
    if (user.role === "user") {
      profiles = await ProfileModal.find({
        bidder: user._id
      });
      if (assignment === "assignedtome" || !user.isManager) {
        filter["$and"] = [...filter["$and"], { assignee: user._id }];
      } else if (assignment === "myprojects") {
        filter["$and"] = [
          ...filter["$and"],
          { profile: { $in: [...profiles] } }
        ];
      } else {
        filter["$and"] = [
          ...filter["$and"],
          {
            $or: [{ assignee: user._id }, { profile: { $in: [...profiles] } }]
          }
        ];
      }
    }

    if (filter["$and"].length === 0) delete filter["$and"];

    const projects = await ProjectModal.find(filter)
      .populate("assignee profile")
      .sort(sortResult)
      .limit(limit)
      .skip(offset);

    const totalProjects = await ProjectModal.find(filter);

    res.status(200).json({
      data: projects,
      length: totalProjects.length,
      batchSize: projects.length
    });
  } catch (error) {
    throw new Error(error.message);
  }
});
