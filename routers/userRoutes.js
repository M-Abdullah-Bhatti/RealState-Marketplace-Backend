const {
   register, login, getAllUsers, getAllPendingUsers
  } = require("../controllers/userController");

  const {isAuthenticatedUser, isAdmin} = require("../middleware/authenticate")
  
  const router = require("express").Router();
  
  router.post("/register", register);
  router.post("/login", login);
  router.get("/all_users", isAdmin, getAllUsers);
  router.get("/all_pending_users",isAdmin, getAllPendingUsers);




  
  module.exports = router;