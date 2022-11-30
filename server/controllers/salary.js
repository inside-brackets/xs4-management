import User from "../modals/user.js";
import Salary from "../modals/salary.js";
import Profile from "../modals/profile.js";
import Milestone from "../modals/milestone.js";

export const createSalary = async (req, res) => {
  try {
    const { user, month, adjustment, incentive, base } = req.body;
    let total = 0;
    adjustment.forEach((x, i) => {
      total += Number(x.amount);
    });
    total += Number(incentive);
    total += Number(base);
    const createdSalary = await Salary.create({
      user: user,
      month: month,
      adjustment: adjustment,
      incentive: incentive,
      base: base,
      total: total,
    });
    res.status(200).send(createdSalary);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getSalaries = async (req, res) => {
  const search = req.body.search ? req.body.search : "";
  const limit = parseInt(req.params.limit);
  const offset = parseInt(req.params.offset);
  let filter = {
    role: {
      $nin: ["admin"],
    },
  };
  if (search !== "") {
    filter.userName = { $regex: search, $options: "i" };
  }
  if (req.body.department.length > 0) {
    filter.department = {
      $in: req.body.department,
    };
  }
  const users = await User.find(filter).sort({ createdAt: 1 });
  try {
    const userSalaries = users.map(async (user) => {
      const prevSalary = await Salary.find({ user: user._id }).sort({
        createdAt: -1,
      });
      if (prevSalary.length === 0) {
        return {
          _id: user._id,
          userName: user.userName,
          fullName: user.firstName + " " + user.lastName,
          contact: user.contact,
          email: user.email,
          department: user.department,
          isManager: user.isManager,
          role: user.role,
          salary: user.salary,
          lastSalary: null,
          lastPaid: false,
        };
      } else {
        return {
          _id: user._id,
          userName: user.userName,
          fullName: user.firstName + " " + user.lastName,
          contact: user.contact,
          email: user.email,
          department: user.department,
          isManager: user.isManager,
          role: user.role,
          salary: user.salary,
          lastSalary: prevSalary[0].month,
          lastPaid: true,
        };
      }
    });
    const result = await Promise.all(userSalaries);
    let fResult;
    if (req.body.department.length === 0) {
      fResult = result.slice(offset, limit + offset);
    } else {
      fResult = result;
    }
    fResult.sort(function compare(a, b) {
      var dateA = new Date(a.lastSalary);
      var dateB = new Date(b.lastSalary);
      return dateA - dateB;
    });
    res.json({ data: fResult, length: result.length });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const getProjects = async (req, res) => {
  try {
    const profiles = await Profile.find({
      bidder: req.body.user,
    });
    const milestones = profiles.map(async (profile) => {
      const milestone = await Milestone.find({
        profile: profile._id,
      }).populate("project");
      return milestone;
    });
    const result = await Promise.all(milestones);
    res.status(200);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const getLastSalary = async (req, res) => {
  try {
    const lastSalary = await Salary.find({
      user: req.body.user,
    }).sort({
      createdAt: -1,
    });
    res.status(200);
    res.json(lastSalary[0]);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
