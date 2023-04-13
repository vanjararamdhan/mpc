import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain, has } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain, has };
import models from "../models";
import appConfig from "../common/appConfig";
import { userRoles, commonStatuses } from "../common/appConstants";
import dbHelper from "../common/dbHelper";
import Helper from "../common/helper";
import jwt_decode from "jwt-decode";
import { Model, Op, where } from "sequelize";
import nodeMailer from "nodemailer";
import sequelize from "sequelize";

/**
 * Login to user and generate JWT
 *
 * @param Request request
 */

const login = async (req) => {
  let responseData = statusConst.error;
  try {
    const email = _.get(req, "email", null);
    const password = _.get(req, "password", null);
    // Find the user by email and if active

    const User = await models.user.findOne({ where: { email: email } });
    const userPassword = _.get(User, "password", "");
    const validPassword = await bcrypt.compare(password, userPassword);

    if (!_.isEmpty(User) && validPassword) {
      const tokenData = await generateToken({ id: User.id, role: User.role });
      const token = _.get(tokenData, "token", null);
      const role = User.role;

      if (token) {
        await User.update({ token });
        responseData = {
          status: 200,
          message: "Login successful",
          data: { token, role },
        };
      }
    } else {
      throw new Error("Incorrect email or password");
    }
  } catch (err) {
    responseData = { ...statusConst.error, message: err.message };
  }
  return responseData;
};

const generateToken = async (options = {}) => {
  let responseData = statusConst.error;

  const userId = _.get(options, "id", 0);
  const updateToken = _.get(options, "updateToken", false) || false;

  try {
    let User = await models.user.findOne({
      attributes: ["id", "email", "userName", "phone", "isActive", "role"],
      where: { id: userId },
    });

    if (_.isEmpty(User)) {
      throw new Error("User not found");
    }

    let userData = User.get({ plain: true }) || {};
    const token = jwt.sign(userData, appConfig.jwtSecretKey);
    if (updateToken == true) {
      await User.update({ token });
    }

    responseData = { status: 200, message: "Success", token, success: true };
  } catch (error) {
    responseData = { status: 422, message: error.message, success: false };
  }
  return responseData;
};

const createUser = async (req) => {
  let responseData = statusConst.error;
  let { userName, address, email, password, phone, gender, role } = req.body;
  const token = req.tokenUser.dataValues.token;
  // var token = req.rawHeaders[1];
  if (token) {
    var decodeToken = jwt_decode(token);
  }
  try {
    if (decodeToken.role == "Admin" || decodeToken.role == "Supervisor") {
      let hashPassword = await bcrypt.hash(password, appConfig.bcryptSaltRound);
      const users = await models.user.create({
        userName,
        address,
        email,
        password: hashPassword,
        phone,
        gender,
        role,
      });
      responseData = {
        status: 200,
        message: "user create successfully",
        success: true,
      };
      // Email sendnig

      const Email = req.body.email;
      const Password = req.body.password;
      const Name = req.body.userName;
      await userCreateEmail(Name, Email, Password);
    } else {
      responseData = {
        status: 400,
        message: "Only Admin & Supervisor can create users",
        success: false,
      };
    }
  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };
    try {
      if (
        ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
          error.name
        )
      ) {
        errors = dbHelper.formatSequelizeErrors(error);
        responseData = { status: 400, errors, success: false };
      }
    } catch (error) {
      responseData = { status: 400, message: error.message };
    }
  }
  return responseData;
};

// user create Email
const userCreateEmail = async (Name, Email, Password) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    secure: false,
    auth: {
      user: "aniket.bediskar.5057@gmail.com",
      pass: "rvbbvzbwrgkllhip",
    },
  });

  await transporter.sendMail({
    from: "aniket.bediskar.5057@gmail.com",
    to: Email,
    subject: "User login credentials",
    html: `<!doctype html>
    <html>

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
            }
        }

        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;

        }

        .table-wrapper,
        .table-field,
        .table-data {
            border: 2px solid black;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width:600px) {
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }

        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }
    </style>
</head>

<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
    <!-- HIDDEN PREHEADER TEXT -->
    <div
        style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        We're thrilled to have you here! Get ready to dive into your new account.
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
            <td bgcolor="#FFA73B" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top"
                            style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1>
                            <h3 style="font-size: 20px; font-weight: 400; margin: 1;">${Name}</h3><img
                                src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120"
                                style="display: block; border: 0px;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">We're excited to have you get started.
                                  Below Your Login credentials.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left">
                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                            <h2> </h2>

                            <table style="width: 100%;" class="table-wrapper">

                                <tr>
                                    <th class="table-field">Username</th>
                                    <th class="table-field">Password</th>
                                </tr>
                                <tr>
                                    <td class="table-data">${Email}</td>
                                    <td class="table-data">${Password}</td>
                                </tr>
                            </table>
                            </p>
                        </td>
                    </tr> <!-- COPY -->
                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Cheers With,<br>MPC Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#FFECD1" align="center"
                            style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?
                            </h2>
                            <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">We&rsquo;re here
                                    to help you out</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                </table>
            </td>
        </tr>
    </table>
</body>

    </html>`,
  });
};

const findByToken = async (token) => {
  let responseData = statusConst.error;
  try {
    // Find user by token
    const User = await models.user.findOne({
      where: {
        token: token,
        isActive: true,
      },
    });
    if (!_.isEmpty(User) && _.isObject(User)) {
      responseData = {
        status: 200,
        message: "Success",
        success: true,
        data: User,
      };
    } else {
      responseData = { status: 422, message: "user not found", success: false };
    }
  } catch (error) {
    responseData = { status: 422, message: error.message };
  }

  return responseData;
};

const changePassword = async (payload) => {
  let responseData = statusConst.authError;

  try {
    const userId = _.get(payload, "tokenUser.id", 0);
    const currentPassword = _.get(payload, "formData.currentPassword", "");
    const newPassword = _.get(payload, "formData.newPassword", "");

    const userData = await models.user.findOne({
      where: {
        id: userId,
        isActive: true,
      },
    });

    if (userData) {
      const validPassword = await bcrypt.compare(
        currentPassword,
        userData.password
      );

      if (validPassword) {
        const hashPassword = await bcrypt.hash(
          newPassword,
          appConfig.bcryptSaltRound
        );

        userData.password = hashPassword;
        await userData.save();

        responseData = {
          status: 200,
          message: "Password change succesfully",
          success: true,
        };
      } else {
        responseData = {
          status: 400,
          message: "Current password is not valid",
          success: false,
        };
      }
    } else {
      responseData = { status: 404, message: "User not found", success: false };
    }
  } catch (error) {
    responseData = { status: 422, message: error.message, success: false };
  }
  return responseData;
};

const updateUser = async (req) => {
  let responseData = statusConst.error;
  const { userName, address, phone, gender, role } = req.body;
  const { id } = req.params;
  const updatedBy = req.tokenUser.id;
  try {
    const users = await models.user.findOne({ where: { id: id } });
    if (!users) {
      throw new Error("users not found");
    } else {
      users.update({ userName, address, phone, gender, role });
    }
    responseData = {
      status: 200,
      message: "data update successfully",
      success: true,
    };
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const logout = async (req) => {
  let responseData = statusConst.error;
  let tokenUser = _.get(req, "tokenUser", {});
  try {
    //Check if  exist
    const user = await models.user.findOne({
      where: { id: tokenUser.id },
    });
    if (!user) {
      return { status: 200, message: "user not found", success: false };
    } else {
      user.update({ token: "" });
      responseData = {
        status: 200,
        message: "user logout successfully",
        success: true,
      };
    }
  } catch (error) {
    responseData = {
      status: 200,
      message: "User already loged out",
      success: false,
    };
  }
  return responseData;
};

const userDetails = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});
  const searchText = _.get(entityParams, "q", "");
  let defaultWhere = { isActive: true };

  if (_.has(entityParams, "q") && !_.isEmpty(searchText)) {
    defaultWhere = {
      [Op.or]: {
        userName: { [Op.like]: `%${searchText}%` },
        role: { [Op.like]: `%${searchText}%` },
        typeOfAsset: sequelize.where(
          sequelize.cast(sequelize.col("user.typeOfAsset"), "varchar"),
          {
            [Op.like]: `%${searchText}%`,
          }
        ),
      },
      isActive: true,
    };
  }

  try {
    const { offset, limit, pagination } = Helper.dataPagination(entityParams);

    const userDeatail = await models.user.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
    if (userDeatail.rows.length > 0) {
      pagination["totalPages"] = Math.ceil(
        (userDeatail || userDeatail).count / pagination.pageSize
      );
      pagination["pageRecords"] = ((userDeatail || {}).rows || []).length || 0;

      responseData = {
        status: 200,
        message: "user data fetch successfully",
        pagination,
        data: userDeatail,
        success: true,
      };
    } else {
      responseData = {
        status: 400,
        message: "user not exist",
        success: false,
      };
    }
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const singleUser = async (userId) => {
  let responseData = statusConst.error;
  try {
    const userData = await models.user.findOne({
      where: { [Op.and]: { id: userId } },
    });

    if (userData) {
      responseData = {
        status: 200,
        message: "user fetch successfully",
        success: true,
        userData,
      };
    } else {
      responseData = {
        status: 400,
        message: "user does not exist",
        success: false,
      };
    }
  } catch (error) {
    console.log(error);
    responseData = { status: 400, message: "user not found", success: false };
  }
  return responseData;
};

const userDelete = async (data, req) => {
  let responseData = statusConst.error;
  const token = req.tokenUser.dataValues.token;

  // var token = req.rawHeaders[1];
  var decodeToken = jwt_decode(token);
  try {
    let userData = await models.user.findOne({ where: { id: data } });
    if (!userData) {
      return { status: 404, message: "user not found", success: false };
    } else {
      if (decodeToken.role == "Admin" || decodeToken.role == "Supervisor") {
        userData.destroy({ where: { id: data } });
        responseData = {
          status: 200,
          message: "user deleted successfully",
          success: true,
        };
      } else {
        responseData = {
          status: 400,
          message: "Only Admin & Supervisor can delete users",
          success: false,
        };
      }
    }
  } catch (error) {
    responseData = { status: 200, message: error.message };
  }
  return responseData;
};

const forgotPassword = async (data) => {
  let responseData = statusConst.error;
  try {
    const email = data.email;
    let user = await models.user.findOne({ where: { email: email } });
    if (user) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        appConfig.jwtSecretKey,
        { expiresIn: "30min" }
      );

      await forgotPasswordMail(token, email);
      await user
        .update({ resetLink: token })
        .then(() => {
          responseData = {
            status: 200,
            message: "Reset Password link has been sent to your email",
            success: true,
          };
        })
        .catch((err) => {
          responseData = { status: 404, message: "Reset password link error" };
        });
    } else {
      responseData = { status: 404, message: "Please enter valid email" };
    }
  } catch (error) {
    responseData = { status: 404, message: error.message };
  }
  return responseData;
};

// forgotpassword & Email
const forgotPasswordMail = async (token, email) => {
  let transporter = nodeMailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "aniket.bediskar.5057@gmail.com",
      pass: "rvbbvzbwrgkllhip",
    },
  });

  await transporter.sendMail({
    from: "aniket.bediskar.5057@gmail.com",
    to: email,
    subject: "MPC User ResetPassword Link ",
    html: `<!doctype html>
    <!DOCTYPE html>

    <html>

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
            }
        }

        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width:600px) {
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }

        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }
    </style>
</head>

<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
    <!-- HIDDEN PREHEADER TEXT -->
    <div
        style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        We're thrilled to have you here! Get ready to dive into your new account.
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
            <td bgcolor="#FFA73B" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top"
                            style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img
                                src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120"
                                style="display: block; border: 0px;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;"> you need to Reset your
                                account Password. Just press the button below.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a
                                                        href=" https://niceishfabrics.com/reset-password?email=${email} " target="_blank"
                                                        style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Reset
                                                        Password</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr> <!-- COPY -->
                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Cheers With,<br>MPC Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#FFECD1" align="center"
                            style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?
                            </h2>
                            <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">We&rsquo;re here
                                    to help you out</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                </table>
            </td>
        </tr>
    </table>
</body>

</html>


    </html>`,
  });
};

const resetPassword = async (req) => {
  let responseData = statusConst.error;
  const bodyData = _.get(req, "body", {});
  const token = _.get(req, "params.token", {});

  let verifed = await jwt.verify(token, appConfig.jwtSecretKey);
  console.log(verifed);

  try {
    let user = await models.user.findOne({ where: { email: verifed.email } });
    if (!user) {
      responseData = {
        status: 401,
        message: "User with this token does not exist",
      };
    } else if (bodyData.newPassword === bodyData.confirmPassword) {
      let password = await bcrypt.hash(
        bodyData.newPassword,
        appConfig.bcryptSaltRound
      );
      await user.update({ password: password });
      responseData = { status: 200, message: "Password has been changed" };
    } else {
      responseData = {
        message: "NewPassword And ConfirmPassword does not match",
      };
    }
  } catch (error) {
    responseData = { status: 400, message: error.message };
  }
  return responseData;
};

const checkAndChangePassword = async (req) => {
  let responseData = statusConst.error;
  let email = req.formData.email;
  try {
    let user = await models.user.findOne({ where: { email: email } });
    if (!user) {
      responseData = {
        status: 401,
        message: "User with this email does not exist",
      };
    } else if (req.formData.newPassword === req.formData.confirmPassword) {
      let password = await bcrypt.hash(
        req.formData.newPassword,
        appConfig.bcryptSaltRound
      );
      await user.update({ password: password });
      responseData = { status: 200, message: "Password has been changed" };
    } else {
      responseData = {
        message: "NewPassword And ConfirmPassword does not match",
      };
    }
  } catch (error) {
    responseData = { status: 400, message: error.message };
  }
  return responseData;
};

const searchService = async (req) => {
  let responseData = statusConst.error;
  try {
    const title = req.query.title;
    var userCondition = title ? { role: { [Op.like]: `%${title}%` } } : null;
    const userSearch = await models.user.findAll({ where: userCondition });
    if (!userSearch) {
      return { status: 404, message: "Search not found", success: false };
    } else {
      responseData = { status: 200, userSearch, success: true };
    }
  } catch (error) {
    responseData = {
      status: 200,
      message: "Some error occurred while retrieving tutorials.",
    };
  }
  return responseData;
};

const UserServices = {
  createUser,
  userCreateEmail,
  login,
  findByToken,
  generateToken,
  changePassword,
  checkAndChangePassword,
  logout,
  updateUser,
  userDetails,
  singleUser,
  userDelete,
  forgotPassword,
  resetPassword,
  searchService,
};

export default UserServices;
