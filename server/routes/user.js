const express = require("express");
const router = express.Router();
const { addTime , getTime ,signIn, login, verify } = require("../controller/user");

router.route("/").post(signIn);

router.route("/verify").post(verify);

router.route("/login").post(login);

router.route("/gettime").get(getTime);

router.route("/addtime").post(addTime);

module.exports = router;
