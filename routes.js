const express = require("express");
const {handleHome,handleLoginPage,handleNewPage,
    handleGetSeparateDetails,handleDeleteRoute,
    handleNewPost, handlePost,handleEditGetPage,
    handleEditPutPage,handleReviewPost,
    handleLogout} = require("./controllers/url");
const router = express.Router({mergeParams: true});
const User = require("./models/user.js");
const passport = require("passport");
const listings = require("./models/url");
const {loggedIn,isOwner} = require("./middleware.js");
const multer = require("multer");
const {storage} = require("./cloudConfig.js");
const upload = multer({storage});

router.get("/",handleHome);

router.get("/new",loggedIn,handleNewPage);

router.get("/get/:id",async(req,res)=>{
    try{
        const UserList= await listings.findById(req.params.id).populate("reviews");
        console.log(UserList);
    res.render("../views/listings/get.ejs",{UserList});
    } catch(err){
        res.send(err);
        console.log(err);
    }
});

router.get("/:id/edit",loggedIn,handleEditGetPage);

router.get("/signUp",(req,res)=>{
    res.render("../views/users/signUp.ejs");
});

router.get("/login",(req,res)=>{
    res.render("../views/users/login.ejs");
});

router.get("/logout",handleLogout);

//POST ROUTES

router.post("/postNew",loggedIn,handlePost);

router.post("/signUp",async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        console.log(username);

    const newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    await req.login(registeredUser,(err)=>{
        if(err){
            console.error(err);
            return next(err);
        }
        req.flash("success","Welcome to wanderLust");
        res.redirect("/");
    });
    }catch(err){
        console.log(err);
        res.redirect("/signUp");
    }
});

router.post("/login",passport.authenticate("local",{failureRedirect: "/login" , failureFlash: true}) ,handleLoginPage);

//UPDATE-PUT ROUTES

router.put("/route/:id",loggedIn,isOwner,upload.single("image"),handleEditPutPage);

//router.
router.delete("/delete/:id",loggedIn,isOwner,handleDeleteRoute);

//review route

router.post("/review/new/:id",loggedIn,isOwner,handleReviewPost);

module.exports = router;

