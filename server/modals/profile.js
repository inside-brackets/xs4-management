import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // search
    title: {
      type: String,
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
    isAdmin: {
      type: Boolean,
      default: false,
    },
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

profileSchema.index({ title: 1, platform: 1 }, { unique: true });

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
