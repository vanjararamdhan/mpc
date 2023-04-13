import userServices from "../services/user.services";
import { get, isEmpty } from "lodash";
const _ = { get, isEmpty };

export const login = (req, res, next) => {
  const bodyData = _.get(req, "body", {});
  userServices.login(bodyData).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

export const createUser = async (req, res, next) => {
  userServices.createUser(req).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const userProfile = async (req, res, next) => {
  const payload = {
    userId: _.get(req, "params.id", {})
  }
  userServices.userProfile(payload).then(result => {
    res.status(result.status).send(result);

  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  })
}

export const changePassword = async (req, res, next) => {
  const payload = {
    tokenUser: _.get(req, "tokenUser", {}),
    formData: _.get(req, "body", {})
  }
  userServices.changePassword(payload).then(result => {
    res.status(result.status).send(result);

  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}
export const checkAndChangePassword = async (req, res, next) => {
  const payload = {
    formData: _.get(req, "body", {})
  }
  userServices.checkAndChangePassword(payload).then(result => {
    res.status(result.status).send(result);

  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}

export const updateUser = async (req, res, next) => {
  userServices.updateUser(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}

export const logout = async (req, res, next) => {
  userServices.logout(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}

export const userDetails = async (req, res, next) => {
  userServices.userDetails(req).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

export const singleUser = async (req, res) => {
  const userId = _.get(req, "params.id", 0);
  userServices.singleUser(userId).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

export const userDelete = (req, res) => {
  const bodydata = _.get(req, "params.id", 0);
  userServices.userDelete(bodydata, req).then((result) => {
    res.status(200).send(result)
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  })
}

export const forgotPassword = async (req, res) => {
  const bodyData = _.get(req, "body", {});
  userServices.forgotPassword(bodyData).then((result) => {
    res.status(200).send(result);
  })
    .catch((err) => {
      res
        .status(422)
        .send({
          status: 422,
          message: err.message || "Something went wrong during forgotpassword!",
        });
    });
};

export const resetPassword = async (req, res) => {
  userServices.resetPassword(req).then((result) => {
    res.status(200).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong during forgotpassword!" });
  });
};

export const searchUser = async (req, res) => {
  userServices.searchService(req).then((result) => {
    res.status(200).send(result);
  })
    .catch((error) => {
      res.status(422).send({ status: 422, message: error.message || "Something went wrong!", });
    });
};
