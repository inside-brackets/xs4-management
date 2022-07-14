import asyncHandler from "express-async-handler";

import ProfileModal from "../modals/profile.js";

// Access: Admin
// Method: POST
// Desc: create profile
// route: /profiles
export const createProfile = asyncHandler(async (req, res) => {
  try {
    let profile = await ProfileModal.findOne({ title: req.body.title });
    if (profile) {
      res.status(500).send({ msg: "Title must be unique" });
      return;
    }
    let createdProfile = await ProfileModal.create(req.body);

    res.status(201);

    res.json(createdProfile);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route: /profiles/:id
export const getProfile = asyncHandler(async (req, res) => {
  try {
    let profile = await ProfileModal.findById(req.params.id).populate("bidder");

    res.status(200);

    res.json(profile);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: PUT
// route: /profiles/:id
export const updateProfile = asyncHandler(async (req, res) => {
  try {
    let updatedProfile = await ProfileModal.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, upsert: true }
    );

    res.status(200);

    res.json(updatedProfile);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Admin
// Method: DELETE
// route: /profiles/:id
export const deleteProfile = asyncHandler(async (req, res) => {
  try {
    // delete profile
    // delete related projects
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Admin
// Method: GET
// route: /profiles/:limit/:offset
export const listProfiles = asyncHandler(async (req, res) => {
  try {
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);
    const { search, searchExact, share__lte, share__gte, bidder, platform } =
      req.body;
    let filter = { share: { $lte: 100, $gte: 0 } };
console.log(bidder)
    if (platform?.length > 0) {
      filter.platform = { $in: platform };
    }
    if (bidder?.length > 0) {
      filter.bidder = { $in: bidder };
    }
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (searchExact) {
      filter.title = searchExact;
    }
    if (share__lte) {
      filter.share["$lte"] = share__lte;
    }
    if (share__gte) {
      filter.share["$gte"] = share__gte;
    }

    const profiles = await ProfileModal.find(filter)
      .populate("bidder")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const totalProfiles = await ProfileModal.find(filter);

    res.status(200).json({ data: profiles, length: totalProfiles.length });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
