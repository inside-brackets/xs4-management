import Project from "../modals/project.js";
import Profile from "../modals/profile.js";
import OtherRevenue from "../modals/otherRevenue.js";
import Expense from "../modals/expense.js";
import Salary from "../modals/salary.js";

export const getBalanceSheet = async (req, res) => {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  if (isNaN(year) || isNaN(month)) throw new Error("Invalid Params");

  try {
    const selectedMonth = new Date(year, month, 1);
    const nextMonth = new Date(year, month + 1, 1);
    let result = {};
    let received = 0,
      cut = 0,
      graphics = 0;

    result.month = selectedMonth.toLocaleString("default", { month: "long" });
    result.year = selectedMonth.getFullYear();

    const salaries = await Salary.aggregate([
      {
        $match: {
          month: { $gte: selectedMonth, $lt: nextMonth },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          department: {
            $ifNull: [{ $first: "$user.department" }, "accounts"],
          },
          adjustment: 1,
          base: 1,
        },
      },
      {
        $unwind: {
          path: "$adjustment",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            id: "$_id",
          },
          department: {
            $first: "$department",
          },
          base: {
            $first: "$base",
          },
          adjustment: {
            $sum: "$adjustment.amount",
          },
        },
      },
      {
        $group: {
          _id: {
            department: "$department",
          },
          base: {
            $sum: "$base",
          },
          adjustment: {
            $sum: "$adjustment",
          },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$_id.department",
          base: 1,
          adjustment: 1,
        },
      },
    ]);
    const projects = await Project.aggregate([
      {
        $lookup: {
          from: "profiles",
          localField: "profile",
          foreignField: "_id",
          as: "profile",
        },
      },
      {
        $lookup: {
          from: "milestones",
          localField: "_id",
          foreignField: "project",
          as: "milestone",
        },
      },
      {
        $unwind: "$milestone",
      },
      {
        $match: {
          "milestone.status": "paid",
          "milestone.paymentDate": { $gte: selectedMonth, $lt: nextMonth },
        },
      },
      {
        $group: {
          _id: {
            title: "$_id",
          },
          title: {
            $first: "$title",
          },
          profile: {
            $mergeObjects: { $arrayElemAt: ["$profile", 0] },
          },
          totalReceived: {
            $sum: "$milestone.amountRecieved",
          },
          employeeCut: {
            $sum: "$milestone.employeeShare",
          },
          graphicCut: {
            $sum: "$milestone.grahicShare",
          },
          milestones: {
            $addToSet: "$milestone",
          },
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          profile: { title: 1, platform: 1 },
          totalReceived: 1,
          employeeCut: 1,
          graphicCut: 1,
          milestones: { title: 1, paymentDate: 1 },
        },
      },
    ]);
    const profiles = await Profile.countDocuments();
    const otherRevenues = await OtherRevenue.aggregate([
      {
        $match: {
          date: { $gte: selectedMonth, $lt: nextMonth },
        },
      },
      {
        $group: {
          _id: null,
          amount: { $sum: "$amount" },
        },
      },
    ]);
    const otherExpenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: selectedMonth, $lt: nextMonth },
        },
      },
      {
        $group: {
          _id: null,
          amount: { $sum: "$amount" },
        },
      },
    ]);

    projects.forEach((project) => {
      received += project.totalReceived;
      cut += project.employeeCut;
      graphics += project.graphicCut;
    });

    result.projects = projects.length;
    result.profiles = profiles;
    result.revenues = {
      amountReceived: received,
      otherReceived: otherRevenues.length > 0 ? otherRevenues[0].amount : 0,
      graphicShare: graphics > 0 ? graphics / 2 : 0,
    };
    result.expenses = {
      graphicPartner: graphics > 0 ? graphics / 2 : 0,
      employeeShare: cut,
      otherExpenses: otherExpenses.length > 0 ? otherExpenses[0].amount : 0,
      salaries: salaries,
    };
    result.clearedProjects = projects;

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
