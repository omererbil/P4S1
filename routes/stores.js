var express = require("express"),
    router=express.Router(),
    multer=require('multer'),
    mongoose=require("mongoose"),
    Store=require("../models/stores"),
    Product=require("../models/products"),
    bodyParser =require("body-parser"),
    formidable = require('formidable'),
    gm=require('gm'),
    fs=require('fs'),
    path=require('path')

         // upload image configration-------------------------------------------------------------------------
    const storage = multer.diskStorage({
    destination: './public/uploads/', filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() +Math.floor(Math.random() * 1000000000000000) + 1+file.originalname+ path.extname(file.originalname));
  }
});
    // init upload
    const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
})

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

 router.get('/',function(req,res){
     res.send('all')
 })

  router.post('/createStore',function(req ,res){
         console.log(req.body)
          var  storeName=req.body.storeName
          var  phone=req.body.phone
          var  country='iraq'
          var  city='erbil'
          var  sponser=100
          var openTime=req.body.openTime
          var  categories=req.body.categories
          var location=req.body.location
          var  author={id:req.body.userId,phone:req.body.phone}
          var views=0
          var newStore={storeName:storeName,phone:phone,country:country,city:city,categories:categories,author:author,views:views,sponser:sponser,location:location,openTime:openTime}

        Store.create(newStore,function(err,store){
            if(err) throw err
            store.adminKey=store._id+store.author.id+Date()
            store.save()
            res.send(store)

      })
    })

    router.post('/editStore/:storeId',function(req ,res){
      Store.findById(req.params.storeId,function(err, store) {
          if(err) throw err
          store.storeName=req.body.storeName
          store.phone=req.body.phone
          store.openTime=req.body.openTime
          store.categories=req.body.categories
          store.location=req.body.location
          store.save()
      })
    })

    //show store
    router.get('/store/:id',function(req,res){
      Store.findById(req.params.id,function(err, store) {
        if(err) throw err
        res.send(store)
      })
    })

    router.post('/uploadProfile/:storeId',upload.single('fileData'),function(req ,res,next){
          Store.findById(req.params.storeId,function(err,store){
            if(err) throw err
            store.profileImage=req.file.filename
            store.save()
          })
        })


     router.post('/addAdmin',function(req, res) {
       var admin={
         name:req.body.name,
         myPhone:req.body.myPhone,
       }

        Store.findById(req.body.storeId,function(err, store) {
            if(err) throw err
            store.admines.push(admin)
            store.save()
           res.send(store)
        })
     })

      router.post('/removeAdmin',function(req, res) {
        Store.findById(req.body.storeId,function(err, store) {
            if(err) throw err
            store.admines=req.body.admines
            store.save()
           res.send(store)
           console.log(store)
        })
     })


     router.get('/stores',function(req,res){
       Store.find({},function(err,stores){
         if(err) throw error
         res.send(stores)
       })
     })

     router.post('/addNote',function(req,res){
       Store.findById(req.body.storeId,function(err,store){
         store.note=req.body.note
         store.save()
       })
     })


     //show store---------------------------------------------------
     router.get('/showStore/:storeId',function(req,res){
       Store.findById(req.params.storeId,function(err,store){
         Product.find({'store.id':req.params.storeId,},function(err,products){
           res.render('showStore',{store:store,products:products})
         })
       })
     })

     router.get('/storeRankSave/:storeId',function(req,res){
       Store.findById(req.params.storeId,function(err,store){
         if(err) throw err
         store.rank=store.rank+4
         store.save()
         })
       })

 module.exports=router;
