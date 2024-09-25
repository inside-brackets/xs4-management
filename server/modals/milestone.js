import mongoose from "mongoose";
import Project from "./project.js";

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    totalAmount: { type: Number, default: 0 },
    exchangeRate: { type: Number, default: 0 },
    employeeShare: { type: Number, default: 0 },
    grahicShare: { type: Number, default: 0 },
    amountRecieved: { type: Number, default: 0 },
    netRecieveable: { type: Number, default: 0 },
    amountDeducted: { type: Number, default: 0 },
    adjustment: { type: Number, default: 0 },
    remarks: { type: String, default: "" },
    paymentDate: { type: Date },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    status: {
      type: String,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

milestoneSchema.post("save", async function (doc) {
  // Find the related project
  const project = await Project.findById(doc.project);

  if (project) {
    // Calculate the new amtReceived and empShare
    const milestones = await doc.model('Milestone').find({ project: doc.project });

    let totalAmt = 0;
    let totalAmtReceived = 0;
    let totalEmpShare = 0;

    milestones.forEach((milestone) => {
      totalAmt += milestone.totalAmount;
      totalAmtReceived += milestone.amountRecieved;
      totalEmpShare += milestone.employeeShare;
    });

    // Update the project with the new values
    project.totalAmount = totalAmt;
    project.amountRecieved = totalAmtReceived;
    project.empShare = totalEmpShare;

    await project.save();
  }
});

const Milestone = mongoose.model("Milestone", milestoneSchema);
export default Milestone;
