import User from "../models/user";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).send("Please fill in all required fields");
  if (password.length < 6)
    return res.status(400).send("Passwords must be at least 6 characters");
  let userExists = await User.findOne({ email }).exec();
  if (userExists) return res.status(400).send("User already exists");

  const user = new User(req.body);
  try {
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong. Please try again");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("Please fill in all required fields");
    let user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("User does not exist");
    // compare password
    user.comparePassword(password, (err, matches) => {
      if (!matches || err) return res.status(400).send("Wrong credentials");

      // Generate a token
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          stripe_account_id: user.stripe_account_id,
          stripe_seller: user.stripe_seller,
          stripeSessions: user.stripeSessions,
        },
      });
    });
  } catch (err) {
    console.log("LOGGIN Failed", err);
    return res.status(500).send("Something went wrong. Please try again");
  }
};
