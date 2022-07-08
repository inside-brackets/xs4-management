import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // search
    title: {
      type: String,
      unique: true,
      required: true,
    },
    platform: {
      type: String,
      enum: ["freelancer", "upwork", "fiver"],
      required: true,
    },
    // $in
    bidder: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // range
    share: { type: Number, required: true },
    platformFee: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// on delete, delete related projects
profileSchema.post("remove", function (doc) {
  console.log("%s has been removed", doc._id);
  // delete all related projects
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
