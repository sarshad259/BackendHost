const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loanCategory: { type: String, required: true },
  subCategory: { type: String, required: true },
  amount: { type: Number, required: true },
  deposit: { type: Number, required: true },
  loanPeriod: { type: String, required: true },
  guarantors: [{ name: String, email: String, location: String, cnic: String }],
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Loan", loanSchema);
