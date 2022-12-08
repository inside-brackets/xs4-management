import mongoose from "mongoose";

const otherRevenueSchema = new mongoose.Schema(
  {
    description: {
      type: "string",
      required: true,
    },
    amount: { type: Number, default: 0 },
    client: { type: "string", required: true },
    date: { type: Date, default: new Date() },
    category: {
      type: String,
      enum: ["office", "profileMembership"],
      default: "office",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OtherRevenue = mongoose.model("OtherRevenue", otherRevenueSchema);
export default OtherRevenue;
