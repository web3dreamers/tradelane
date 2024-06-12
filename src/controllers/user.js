const User = require('../models/user')
const bcrypt = require('bcrypt')

const { createToken } = require('../utility/jwt')
const CustomError = require('../models/customError')
const Utility = require('../utility/utils')

const signUp = async (req, res, next) => {

  const {password ,personalDetails,contactInfo,professionalInfo,financialInfo,bankingInfo,riskTolerenceInfo,legalInfo,financeGoalInfo,preferredInvestmentProduct,riskAssesmentInfo, documentationInfo,communicationInfo,techInfo,emergencyInfo,estateInfo,specialInfo,EMEACompliance,USCompliance,APACCompliance} = req.body
  console.log("[User] [signUp] Starting ", req.body);

  try {
    const userId =  Utility.generateUniqueNumber("USER");
    // Since username should also be unique
    let user = await User.findOne({ userId })

    if (user) {
      return next(
        new CustomError('User with provided userId already exists', 403)
      )
    }
    user = new User({
      userId,
      password,
      personalDetails,
      contactInfo,
      professionalInfo,
      financialInfo,
      bankingInfo,
      riskTolerenceInfo,
      legalInfo,
      financeGoalInfo,
      preferredInvestmentProduct,
      riskAssesmentInfo,
      documentationInfo,
      communicationInfo,
      techInfo,
      estateInfo,
      specialInfo,
      emergencyInfo,
      EMEACompliance,
      USCompliance,
      APACCompliance
    })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    user.password = hashedPassword

    await user.save()
    console.log("[User] [signUp] Exiting ");

    res.status(201).json({ success: true, "message": user })
  } catch (err) {
    console.log("[User] [signUp] Error ", err);
    next(new CustomError('Something went wrong', 500))
  }
}

const login = async (req, res, next) => {

  const { userId, password } = req.body
  console.log("[User] [Login] Starting ", req.body);

  try {
    let user = await User.findOne({ 'userId': userId})

    console.log("[User] [signUp] Error ");
    if (!user) return next(new CustomError('Invalid credentials', 400))

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      console.log("[User] [Login] Error ");
      return next(new CustomError(`Invalid credentials`, 400))
    }
  //   res.send({ 
  //     success: true, 
  //     message: docs
  //  })

    // const accessToken = createToken({
    //   id: user._id,
    // })
    // user.isLoggedIn = true
    // await user.save()
    user.password="";
    res
      // .header('authorization', accessToken)
      .send({ success: true,"profile": user })
      console.log("[User] [Login] Exiting ");
  } catch (err) {
    console.log(err)
    next(new CustomError('Something went wrong', 500))
  }
}
const changePassword = async (req, res, next) => {

  const { userId, oldPassword, newPassword } = req.body
  console.log("[User] [changePassword] Starting ", req.body);

  try {
    let user = await User.findOne({ 'userId': userId})

    console.log("[User] [changePassword] Error ");
    if (!user) return next(new CustomError('Invalid credentials', 400))

    const isMatch = await bcrypt.compare(oldPassword, user.password)

    if (!isMatch) {
      console.log("[User] [changePassword] Error ");
      return next(new CustomError(`Invalid credentials`, 400))
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword

    await user.save()

    console.log("[User] [changePassword] Exiting ");
    res.status(201).json({ success: true, "message": "Password changed" })

  } catch (err) {
    console.log(err)
    next(new CustomError('Something went wrong', 500))
  }
}
const getUser = async (req, res, next) => {
  try {
    console.log("[User] [getUser] Starting ",  req.params.userId);
    User.find({'userId' : req.params.userId })
    .then(function (docs) {
      console.log("[User] [getUser] Docs ::  ", docs);
      res.send({ 
        success: true, 
        message: docs
     })
    })
    .catch(function (err) {
      console.log(err);
      res.send({ 
        success: false, 
        message : "",
        errors: err
      })
    });
    console.log("[User] [getUser] Exiting ");
  } catch (err) {
    console.log(err)
    next(new CustomError('Something went wrong', 500))
  }
}
const putUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    console.log("[User] [putUser] Starting ",  req.body);

    let userDBObj = await User.findOne({ 'userId' : req.params.userId  })

    if(userDBObj == undefined || userDBObj == null){
      res.send({ 
        success: false, 
        message : "schemaId not found",
        errors: "schemaId not found"
      })
      return;
    }
    userDBObj.address = req.body.address;
    userDBObj.username = req.body.username;
    userDBObj.group = req.body.group;

    await userDBObj.save()
    console.log("[User] [putUser] Docs ::  ", userDBObj);
    res.send({ 
      success: true, 
      message: userDBObj
   })
    console.log("[User] [putUser] Exiting ");

  } catch (err) {
    console.log(err)
    next(new CustomError('Something went wrong', 500))
  }
}
const listUsers = async (req, res, next) => {
  try {
    console.log("[User] [listUsers] Starting ");
    User.find()
    .then(function (docs) {
      console.log("[User] [listUsers] Docs ::  ", docs);
      res.send({ 
        success: true, 
        message: docs
      })
    })
    .catch(function (err) {
      console.log(err);
      res.send({ 
        success: false, 
        message : "",
        errors: err
      })
    });
    console.log("[User] [listUsers] Exiting ");
  } catch (err) {
    console.log(err)
    next(new CustomError('Something went wrong', 500))
  }
}
const deleteUser = async (req, res, next) => {
  try {
    console.log("[User] [deleteUser] Starting ",  req.params.userId);
      User.findOneAndDelete({ 'userId' : req.params.userId  })
      .then(function (docs) {
        console.log("[User] [deleteUser] Docs ::  ", docs);
        res.send({ 
          success: true, 
          message: docs
        })
      })
      .catch(function (err) {
        console.log(err);
        res.send({ 
          success: false, 
          message : "",
          errors: err
        })
      });
    console.log("[User] [deleteUser] Exiting ");

  } catch (err) {
    console.log(err)
    next(new CustomError('Something went wrong', 500))
  }
}
module.exports = { signUp, login, getUser, putUser, listUsers, deleteUser, changePassword}