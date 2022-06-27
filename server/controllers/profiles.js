import ProfileModal from "../modals/profile.js";

// Access: Admin
// Method: POST
// Desc: create profile
// route: /profile
export const createProfile = asyncHandler(async (req, res) => {
  try {
    let createdProfile = await ProfileModal.create(req.body);

    res.status(201);

    res.json(createdProfile);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Access: Private
// Method: GET
// route: /profile/:id
export const getProfile = asyncHandler(async (req, res) => {
  try {
    let profile = await ProfileModal.findById(req.params.id);

    res.status(200);

    res.json(profile);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: PUT
// route: /profile/:id
export const putProfile = asyncHandler(async (req, res) => {
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
// route: /profile/:id
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
// route: /profile/:limit/:offset?search=asdasd&&bidder=asdasd&&share__lt=30&&share__gte=20
export const listProfiles = asyncHandler(async (req, res) => {
  try {
    console.log("listProfiles", req.params.offset);
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);
    const { title, share__lt, share__ge, bidder } = req.query;
    let filter = { share: { $lt: 100, $gte: 0 } };

    if (bidder) {
      filter.bidder = bidder;
    }
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (share__lt) {
      filter.share["$lt"] = share__lt;
    }
    if (share__ge) {
      filter.share["$gte"] = share__ge;
    }

    const profiles = await ProfileModal.find(filter)
      .populate("owner")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    res.status(200).json(profiles);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
