import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // search
    profile: { type: mongoose.Types.ObjectId, ref: "Profile", required: true }, // $in
    assignee: { type: [mongoose.Types.ObjectId], ref: "User" }, // $in
    clientName: { type: String }, // search
    clientCountry: { type: String },
    description: { type: String, default: "N/A" },
    currency: { type: String },
    projectType: {
      type: String,
      enum: [
        "BP",
        "FM",
        "PD",
        "BP + FM",
        "BP + PD",
        "FM + PD",
        "BP + FM + PD",
        "legal contract",
        "assignment",
        "company profile",
        "presentation",
        "other graphics",
        "SOP + Policies",
        "bookkeeping",
        "excel tamplets",
        "market research",
        "market plan",
        "proposal",
      ],
      required: true,
    }, // $in array
    recruiterName: { type: String }, // search
    hasRecruiter: { type: Boolean }, // exact
    status: {
      type: String,
      enum: ["new", "open", "underreview", "cancelled", "closed"],
      required: true,
    }, // $in
    totalAmount: { type: Number, default: 0 }, // range
    amountRecieved: { type: Number }, // range
    exchangeRate: { type: Number }, // range\
    adjustment: { type: Number }, // range

    empShare: { type: Number }, // range
    awardedAt: { type: Date }, // range
    closedAt: { type: Date }, // range
    deadlineAt: { type: Date }, // range
    files: [
      {
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ["chat", "other"],
          required: true,
        },
        files: { type: [String], default: "" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
