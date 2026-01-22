// controllers/leaderboardController.js
import Leaderboard from "../models/Leaderboard.js";
import User from "../models/User.js";
import Userbadge from "../models/Userbadge.js";
// export const getLeaderboard = async (req, res) => {
//   const { period } = req.params;

//   if (!["daily", "weekly", "monthly"].includes(period)) {
//     return res.status(400).json({ message: "Invalid period" });
//   }

//   const leaderboard = await Leaderboard.findOne({ period })
//     .sort({ createdAt: -1 });

//   if (!leaderboard) {
//     return res.json({ users: [] });
//   }

//   res.json({
//     period,
//     users: leaderboard.users
//   });
// };
export const getLeaderboard = async (req, res) => {
  try {
    const { period } = req.params;

    if (!["daily", "weekly", "monthly"].includes(period)) {
      return res.status(400).json({ message: "Invalid period" });
    }

    const leaderboard = await Leaderboard.findOne({ period })
      .sort({ createdAt: -1 })
      .populate({
        path: "users.userId",
        select: "username email" 
      });

    if (!leaderboard) {
      return res.json({ period, users: [] });
    }

    // 🔥 flatten populated user data
    const users = leaderboard.users.map(user => ({
      _id: user._id,
      userId: user.userId._id,
      name: user.userId.username,
      email: user.userId.email,
      points: user.points,
      rank: user.rank
    }));

    res.status(200).json({
      period,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGamificationDashboard = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("username email points");
  const badges = await Userbadge.find({ userId })
    .populate("badgeId");
  const weekly = await Leaderboard.findOne({ period: "weekly" })
    .sort({ createdAt: -1 });

  const rank = weekly?.users.find(
    u => u.userId.toString() === userId

  );

  res.json({
      username: user.username,   
      email: user.email, 
    points: user.points,
    rank: rank?.rank || null,
    badges
  });
};
