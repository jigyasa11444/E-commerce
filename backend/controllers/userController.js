import user from '../models/uesrModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import bcrypt from 'bcryptjs';
import createToken from '../utils/createToken.js';


const createUser = asyncHandler(async (req, res) => {
  const{username, email, password} = req.body;
   
  if(!username || !email || !password){
    throw new Error ("please fill all the inputs");
  }

  const userExist = await user.findOne({email})
  if(userExist){
    return res.status(400).send("user already exists");
  }

  //adding bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new user({username, email, password: hashedPassword });

  try {
    await newUser.save() // store data into DB
    createToken(res, newUser._id);

    res.status(201)
    .json(
      {_id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });

  } catch (error) {
    res.status(400)
    throw new Error("Invalid  user data");
  }
});

//userId
// USERLOGIN

const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  const existingUser = await user.findOne({email})
  
  if(existingUser) {
    const ispasswordValid = await bcrypt.compare(
      password, existingUser.password
    )

    if (ispasswordValid) {
      createToken(res, existingUser._id)


      res.status(201).json({
          _id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          isAdmin: existingUser.isAdmin,
        });
        return; //exit the function after sending the response

    }
  }
});


// LOGGING OUT USER

const logoutCurrentUser = asyncHandler (async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

 return res.status(200).json({message: "Loged out successfully"});
})

// get all users

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await user.find({});
    res.json(users);
  
})

// get user profile

const getCurrentUserProfile =asyncHandler(async (req, res) => {
  const User = await user.findById(req.user._id);

  if(User){
    res.json({
      _id: User._id,
      username: User.username,
      email: User.email,
    });
  }else{
    res.status(404);
    throw new Error("User not gound");
  }
})

// updating current user profile

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const User = await user.findById(req.user._id);

  if(User) {
    User.username = req.body.username || User.username
    User.email = req.body.email || User.email

    if(req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      User.password = hashedPassword;
    }

    const updateUser = await User.save();

    res.json({
      _id: updateUser._id,
      username: updateUser.username,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    })
  }else {
    res.status(404);
    throw new Error("User not found");
  }
})

// delet user as an admin

const deleteUserById = asyncHandler(async (req, res) => {
  const User = await user.findById(req.params.id);

  if(User){
    if(User.isAdmin){
      res.status(400);
      throw new Error("cannot delet admin user")
    }

    await user.deleteOne({_id: User._id})
    res.json({message: "user removed"})

  }else {
    res.status(404);
    throw new Error("User not found");
  }
})

//get user by ID as an admin

const getUserById = asyncHandler(async (req, res) => {
  const User = await user.findById(req.params.id).select('-password')

  if(User){
    res.json(User)
  }else {
    res.status(404);
    throw new Error("User not found");
  }
})

// update user by admin

const updateUserById = asyncHandler (async (req, res) => {
  const User = await user.findById(req.params.id);

  if(User){
    User.username = req.body.username || User.username;
    User.email = req.body.email || User.email;
    User.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await User.save()

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  }else{
    res.status(404);
    throw new Error("User not found");
  }
})


export {
  createUser,
  loginUser, 
  logoutCurrentUser, 
  getAllUsers,
  getCurrentUserProfile, 
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById 

};