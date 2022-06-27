import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    bidder: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    share: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// on delete delete related projects

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
