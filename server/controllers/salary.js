import User from "../modals/user.js";
import Salary from "../modals/salary.js";
import Profile from "../modals/profile.js";
import Milestone from "../modals/milestone.js";

export const createSalary = async (req, res) => {
  try {
    const { user, year, month, adjustment, incentive, base } = req.body;
    let total = 0;
    adjustment.forEach((x, i) => {
      total += Number(x.amount);
    });
    total += Number(incentive);
    total += Number(base);
    const createdSalary = await Salary.create({
      user: user,
      year: year,
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
  const year = req.params.year;
  const month = req.params.month;
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
      let employeeShare = 0;
      if (user.isManager) {
        const prevMonth = new Date(year, month, 1);
        const thisMonth = new Date(year, Number(month) + 1, 0);

        const profiles = await Profile.find({
          bidder: user._id,
        });
        const milestones = profiles.map(async (profile) => {
          const milestone = await Milestone.find({
            profile: profile._id,
          });
          return milestone;
        });
        const result = await Promise.all(milestones);
        result.map((project) => {
          if (project.length > 0) {
            project.map((milestone) => {
              const milestoneDate = new Date(milestone.paymentDate);
              if (
                milestone.status === "paid" &&
                milestoneDate >= prevMonth &&
                milestoneDate <= thisMonth
              ) {
                employeeShare += milestone.employeeShare;
              }
            });
          }
        });
      }
      const prevSalary = await Salary.find({
        user: user._id,
        year: year,
        month: month,
      }).sort({
        createdAt: -1,
      });
      if (prevSalary.length === 0) {
        return {
          _id: user._id,
          userName: user.userName,
          fullName: user.firstName + " " + user.lastName,
          department: user.department,
          isManager: user.isManager,
          role: user.role,
          salary: user.salary,
          incentive: employeeShare,
          paid: false,
        };
      } else {
        return {
          _id: user._id,
          userName: user.userName,
          fullName: user.firstName + " " + user.lastName,
          department: user.department,
          isManager: user.isManager,
          role: user.role,
          salary: user.salary,
          incentive: employeeShare,
          paid: true,
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
    // fResult.sort(function compare(a, b) {
    //   var dateA = new Date(a.lastSalary);
    //   var dateB = new Date(b.lastSalary);
    //   return dateA - dateB;
    // });
    res.json({ data: fResult, length: result.length });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const getProjects = async (req, res) => {
  try {
    const prevMonth = new Date(req.body.year, req.body.month, 1);
    const thisMonth = new Date(req.body.year, Number(req.body.month) + 1, 0);

    const profiles = await Profile.find({
      bidder: req.body.user,
    });
    const milestones = profiles.map(async (profile) => {
      const milestone = await Milestone.find({
        profile: profile._id,
      }).populate("project profile");
      return milestone;
    });
    const result = await Promise.all(milestones);
    let companyGross = 0;
    let employeeShare = 0;
    let arr = [];
    result.map(async (project) => {
      if (project.length > 0) {
        project.map(async (milestone) => {
          const milestoneDate = new Date(milestone.paymentDate);
          if (
            milestone.status === "paid" &&
            milestoneDate >= prevMonth &&
            milestoneDate <= thisMonth
          ) {
            companyGross += milestone.amountRecieved;
            employeeShare += milestone.employeeShare;
            arr.push(milestone);
          }
        });
      }
    });
    if (arr.length > 0) {
      arr.sort((a, b) => (a.paymentDate < b.paymentDate ? 1 : -1));
    }
    res.status(200);
    res.json({ milestones: arr, gross: companyGross, share: employeeShare });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const getSalary = async (req, res) => {
  let userSalary = {};
  let paid = false;
  const year = req.params.year;
  const month = req.params.month;
  try {
    await Salary.find({ user: req.params.id, year: year, month: month }).then(
      (salary) => {
        if (salary.length > 0) {
          userSalary = salary;
          paid = true;
        }
      }
    );
    res.status(200).send({
      year: year,
      month: month,
      user: req.params.id,
      salary: userSalary,
      paid: paid,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
