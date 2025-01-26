const express = require("express");
const Loan = require("../models/Loan");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Loan Request
router.post("/", authMiddleware, async (req, res) => {
  const { loanCategory, subCategory, amount, deposit, loanPeriod, guarantors } =
    req.body;

  const loan = new Loan({
    userId: req.userId,
    loanCategory,
    subCategory,
    amount,
    deposit,
    loanPeriod,
    guarantors,
  });

  await loan.save();
  res.status(201).send("Loan request submitted successfully");
});

// Get Loan Requests (Admin)
router.get("/", authMiddleware, async (req, res) => {
  const loans = await Loan.find().populate("userId");
  res.json(loans);
});

module.exports = router;
