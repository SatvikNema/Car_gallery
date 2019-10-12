var express = require("express");
var router  = express.Router();
var comments = require("../models/comments");
var company_model = require("../models/models");

router.get("/model_select/:id/addcomment",isLoggedIn, function(req, res){
	company_model.findById(req.params.id).populate("comments").exec(function(err, foundModel){
		if(err){
			console.log("Model found NOT for commenting");
		}else{
			res.render("add_comment", {model:foundModel});
		}
	});
});

router.post("/model_select/:id/addcomment",isLoggedIn, function(req, res){
	company_model.findById(req.params.id).populate("comments").exec(function(err, foundModel){
		if(err){
			console.log("Model to comment NOT FOUND");
		}else{
			comments.create({
				author: "Satvik Nema",
				text: req.body.content
			}, function(err, curComment){
				//console.log("hello from inside the create block");
				curComment.author.id = req.user._id;
               curComment.author.username = req.user.username;
               //console.log("Comment added:"+curComment)
               //save comment
               curComment.save(function(err, savedComment){
               	if(err){
               		console.log(err)
               	}else{
               		//console.log("Comment saved successfully!");
		               	foundModel.comments = foundModel.comments.concat([savedComment]);
						foundModel.save(function(err, upcomment){
							if(err){
								console.log("Problem in saving comment");
							}else{

								//console.log("Comment successfully saved in DB");
								res.redirect("/model_select/"+req.params.id);
							}
						});
               	}
               });				
			});
		}
	});
});

router.get("/model_select/:id/addcomment/:comment_id/edit",checkOwnerCommentShip,function(req, res){
	comments.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err)
		}else{
			console.log(foundComment)
			res.render("edit_comment", {comment:foundComment, model_id:req.params.id})
		}
	});
	//res.render("edit_comment");
});

router.put("/model_select/:id/addcomment/:comment_id", checkOwnerCommentShip,function(req, res){
	comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/model_select/" + req.params.id);
      }
   });
});

router.delete("/model_select/:id/addcomment/:comment_id", checkOwnerCommentShip,function(req, res){
    //findByIdAndRemove
    comments.
    findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/model_select/" + req.params.id);
       }
    });
});

function checkOwnerCommentShip(req, res, next){
	if(req.isAuthenticated()){
        comments.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;