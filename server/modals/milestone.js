import mongoose from "mongoose";

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
    paymentDate: { type: Date },
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

const Milestone = mongoose.model("Milestone", milestoneSchema);
export default Milestone;
