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
      enum: [
        "corporate_registration",
        "fbr_registrations",
        "income_tax_return",
        "ipo_trademark",
        "sales_tax_return",
        "accounts_preparation",
        "audit_accounts",
      ],
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
