//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://kashan:test123@cluster0.vxjmcow.mongodb.net/todolist2", { useNewUrlParser: true });

const itemsSchema = {
  name: String,

}

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
  name: "Welcome To Youer to do list!"
});
const item2 = new Item({
  name: "Welcome To You'r to do list!"
});
const item3 = new Item({
  name: "hit + button!"
});

const defaulitems = [item1, item2, item3];

const listSchema = {
  name:String,
  items :[itemsSchema]
};

const List = mongoose.model("List",listSchema);

//Item.insertMany(defaulitems);



app.get("/", function (req, res) {



  Item.find({}).then((Fditem) => res.render("list", { listTitle: "Today", newListItems: Fditem }))
    .catch((err) => { console.log(err); });
});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const lName =req.body.list;
  const item = new Item ({
    name:itemName
  });

  if (lName ==="Today"){
    item.save();
  res.redirect("/");
  }
  else{
     List.findOne({name : lName}).then((Flist) => {Flist.items.push(item);
     Flist.save();
     res.redirect("/"+lName);
     }
     )
     .catch((err) => { console.log(err); });
  }
  
  
});

app.post("/delete", function (req, res) {
  const chkitid =req.body.checkbox;
  const lName = req.body.LName;

  if(lName === "Today" ){
    Item.findByIdAndRemove(chkitid).then(() => console.log("sucess"))
  .catch((err) => { console.log(err); });
  res.redirect("/");
  }
  else{
    List.findOneAndUpdate({name:lName},{$pull:{items:{_id:chkitid}}}).then((Flist) => res.redirect("/"+lName))
    .catch((err) => { console.log(err); });
  }

  
 
});
app.get("/:customlistName",function(req,res){
  const cname = req.params.customlistName;

  
  List.findOne({name : cname}).then((Flist) => {if (!Flist){
    const list = new List ({
      name : cname ,
      items : defaulitems
    }); 
    list.save();
    res.redirect("/"+cname);
  }
  else{
    res.render("list",{ listTitle: Flist.name, newListItems: Flist.items } ) ; 
    
  }})
    .catch((err) => { console.log(err); });
});
app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server started on port " + port);
});
