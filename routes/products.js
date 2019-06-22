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



    router.post('/uploadProduct/:storeId',upload.any(),function(req,res,next){
        var mainCategory
        var images=[]
      var storeId=req.params.storeId
             for(var i=0;i<req.files.length;i++){
                images[i]=req.files[i].filename
             }
             Store.findById(storeId,function(err,store){
                 if(err) throw err
                  if(req.body.mainCategory!="null"){
                      mainCategory=req.body.mainCategory
                      }else{
                          mainCategory=store.categories[0].value
                      }

             var newProduct={
                 images:images,
                 nameKurdish:req.body.nameKurdish,
                 nameArabic:req.body.nameArabic,
                 nameEnglish:req.body.nameEnglish,
                 price:req.body.price,
                 currency:req.body.currency,
                 mainCategory:mainCategory,
                 price:req.body.price,
                 spesifications:req.body.spesifications,
                 store:{id:store._id,
                        city:store.city,
                        storeName:store.storeName,
                        location:{
                          latitude:store.location.latitude,
                          longitude:store.location.longitude,
                        },
                        phone:store.phone
                 },
             }

             Product.create(newProduct,function(err,product){
                 if(err) throw err
                 res.send(product)

             })
        })
    })

      router.get('/storeProducts/:storeId',function(req,res){
          Product.find({'store.id':req.params.storeId},function(err,products){
              if(err) throw err
              res.send(products)
          })
      })


      router.post('/discountProduct/:productId',function(req,res){
         Product.findById(req.params.productId,function(err,product){
             if(err) throw err
             product.discountPrice=req.body.discountPrice
             product.discountPeriod=req.body.discountPeriod
             product.save()
         })

      })

      //showAll--------------------------------------------------------------------------------------------------------
      router.get('/showAll/:request/:userId/:lastKeyword/:gender/:c1/:c2/:c3/:c4/:c5/:c6/:c7/:c8/:c9/:c10/:c11/:c12/:c13/:c14/:c15/:c16',function(req, res) {
          var productSend=[]
          var userId=[req.params.userId]
          var request=req.params.request
          var k = new RegExp(escapeRegex(req.params.lastKeyword), 'gi');

         if(req.params.lastKeyword!=='null'){
              var c1s=6*request
              var c1l=6
              var c2s=2*request
              var c2l=2
              var c3s=1*request
              var c3l=1
              var c4s=1*request
              var c4l=1
              var c5s=4*request
              var c5l=4
         }else{
              var c1s=10*request
              var c1l=10
              var c2s=4*request
              var c2l=4
              var c3s=1*request
              var c3l=1
              var c4s=1*request
              var c4l=1
              var c5s=4*request
              var c5l=4
    }

          if(req.params.gender==='male'){
              var exceptCategries=['womenClothes','bagsAndShoesWomen']
          }else{
              var exceptCategries=['menClothes','menShoes']
          }


           Product.find({$and:[{mainCategory:{$nin:exceptCategries}},{userSeens:{$nin:userId}},{'nameKurdish':k}]}).sort({ "rank": -1 }).limit(6).exec(function(err,kr){
              if(err) throw err
              if(kr.length>0){
              for(var i=0;i<kr.length;i++){
                  productSend.push(kr[i])
              }
              }

              Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c1}]}).sort({ "rank": -1 }).skip(c1s).limit(c1l).exec(function(err,c1r){
                  if(err) throw err
                  if(c1r.length>0){
                  for(var i=0;i<c1r.length;i++){
                      productSend.push(c1r[i])
                  }
                  }else{
                         Product.find({'mainCategory':req.params.c1}).exec(function(err,products){
                      if(err) throw err
                      for(var i=0;i<products.length;i++){
                            products[i].userSeens = products[i].userSeens.filter(function(item) {
                            return item !== req.params.userId
                         })
                         products[i].save()

                      }
                     })

                  }

          Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c2}]}).sort({ "rank": -1 }).skip(c2s).limit(c2l).exec(function(err,c2r){
              if(err) throw err
              if(c2r.length>0){
              for(var i=0;i<c2r.length;i++){
                  productSend.push(c2r[i])
              }
              }else{
                     Product.find({'mainCategory':req.params.c2}).exec(function(err,products){
                  if(err) throw err
                  for(var i=0;i<products.length;i++){
                        products[i].userSeens = products[i].userSeens.filter(function(item) {
                        return item !== req.params.userId
                     })
                     products[i].save()

                  }
                  })

              }

    //c3-----------------------------------------
             Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c3}]}).sort({ "rank": -1 }).skip(c3s).limit(c3l).exec(function(err,c3r){
              if(err) throw err
              if(c3r.length>0){
              for(var i=0;i<c3r.length;i++){
                  productSend.push(c3r[i])
              }
              }else{
                     Product.find({'mainCategory':req.params.c3}).exec(function(err,products){
                  if(err) throw err
                  for(var i=0;i<products.length;i++){
                        products[i].userSeens = products[i].userSeens.filter(function(item) {
                        return item !== req.params.userId
                     })
                     products[i].save()
                  }
                 })
              }
              //c4----------------------------------

              Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c4}]}).sort({ "rank": -1 }).skip(c4s).limit(c4l).exec(function(err,c4r){
              if(err) throw err
              if(c4r.length>0){
              for(var i=0;i<c4r.length;i++){
                  productSend.push(c4r[i])
              }
              }else{
                     Product.find({'mainCategory':req.params.c4}).exec(function(err,products){
                  if(err) throw err
                  for(var i=0;i<products.length;i++){
                        products[i].userSeens = products[i].userSeens.filter(function(item) {
                        return item !== req.params.userId
                     })
                     products[i].save()

                  }
                  })

              }

             Product.find({$and:[{userSeens:{$nin:userId}},{'store.id':'5ce6729b8edae00e294e86db'}]}).sort({ "rank": -1 }).skip(c5s).limit(c5l).exec(function(err,c5r){
              if(err) throw err
              if(c5r.length>0){
              for(var i=0;i<c5r.length;i++){
                  productSend.push(c5r[i])
              }
              }else{
                     Product.find({'store.id':'5ce6729b8edae00e294e86db'}).exec(function(err,products){
                  if(err) throw err
                for(var i=0;i<products.length;i++){
                        products[i].userSeens = products[i].userSeens.filter(function(item) {
                        return item !== req.params.userId
                     })
                     products[i].save()

                  }
                  })
              }




            res.send(productSend)


        })
      })
      })
      })
      })
      })
      })

  //category-----------------------------------------------------------------------------------------
     router.get('/category/:request/:c/:k0/:k1/:k2/:k3/:s0Id/:s1Id/:s2Id/:s3Id/:s4Id/:s5Id/:s6Id',function(req, res) {
          var productSend=[]
          var userId=[req.params.userId]
          var request=req.params.request
          var k0 = new RegExp(escapeRegex(req.params.k0), 'gi');
          var k1 = new RegExp(escapeRegex(req.params.k1), 'gi');
          var k2 = new RegExp(escapeRegex(req.params.k2), 'gi');
          var k3 = new RegExp(escapeRegex(req.params.k3), 'gi');
          var s0Id=req.params.s0Id
          var s1Id=req.params.s1Id
          var s2Id=req.params.s2Id
          var s3Id=req.params.s3Id
          var s4Id=req.params.s4Id
          var s5Id=req.params.s5Id

          var k0s=4*request
          var k1s=1*request
          var k2s=1*request
          var k3s=1*request
          var s0s=2*request
          var s1s=2*request
          var s2s=1*request
          var s3s=1*request
          var msS=5*request


          Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c},{'nameKurdish':k0}]}).sort({ "rank": -1 }).skip(k0s).limit(4).exec(function(err,k0r){
              if(err) throw err
              if(k0r.length>0){
              for(var i=0;i<k0r.length;i++){
                  productSend.push(k0r[i])
              }
              }
              Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c},{'nameKurdish':k1}]}).sort({ "rank": -1 }).skip(k1s).limit(1).exec(function(err,k1r){
              if(err) throw err
              if(k1r){
                  productSend.push(k1r[0])
              }
              Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c},{'nameKurdish':k2}]}).sort({ "rank": -1 }).skip(k2s).limit(1).exec(function(err,k2r){
              if(err) throw err
              if(k2r){
                  productSend.push(k2r[0])
              }

             Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c},{'nameKurdish':k3}]}).sort({ "rank": -1 }).skip(k3s).limit(1).exec(function(err,k3r){
              if(err) throw err
              if(k3r){
                  productSend.push(k3r[0])
              }

               Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c},{'store.id':s0Id}]}).sort({ "rank": -1 }).skip(s0s).limit(2).exec(function(err,s0r){
              if(err) throw err
               if(s0r.length>0){
              for(var i=0;i<s0r.length;i++){
                  productSend.push(s0r[i])
              }
              }

               Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c},{'store.id':s1Id}]}).sort({ "rank": -1 }).skip(s1s).limit(1).exec(function(err,s1r){
              if(err) throw err
              if(s1r){
                  productSend.push(s1r[0])
              }

               Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c},{'store.id':s2Id}]}).sort({ "rank": -1 }).skip(s2s).limit(1).exec(function(err,s2r){
              if(err) throw err
              if(s2r){
                  productSend.push(s2r[0])
              }
                Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c},{'store.id':s3Id}]}).sort({ "rank": -1 }).skip(s3s).limit(1).exec(function(err,s3r){
              if(err) throw err
              if(s3r){
                  productSend.push(s3r[0])
              }

           Product.find({$and:[{userSeens:{$nin:userId}},{'store.id':'5ce6729b8edae00e294e86db'}]}).sort({ "rank": -1 }).limit(3).exec(function(err,mp){
              if(err) throw err
              if(mp.length>0){
              for(var i=0;i<mp.length;i++){
                  productSend.push(mp[i])
              }
              }else{
                     Product.find({'store.id':'5ce6729b8edae00e294e86db'}).exec(function(err,products){
                  if(err) throw err
                for(var i=0;i<products.length;i++){
                        products[i].userSeens = products[i].userSeens.filter(function(item) {
                        return item !== req.params.userId
                     })
                     products[i].save()

                  }
                  })

              }
              Product.find({$and:[{userSeens:{$nin:userId}},{'mainCategory':req.params.c}]}).sort({ "rank": -1 }).skip(msS).limit(5).exec(function(err,ms){
            if(err) throw err
            if(ms.length>0){
            for(var i=0;i<ms.length;i++){
                productSend.push(ms[i])
            }
            }else{
                   Product.find({'mainCategory':req.params.c}).exec(function(err,products){
                if(err) throw err
              for(var i=0;i<products.length;i++){
                      products[i].userSeens = products[i].userSeens.filter(function(item) {
                      return item !== req.params.userId
                   })
                   products[i].save()

                }
                })

            }

              res.send(productSend)
         })
     })
     })
     })
     })
     })
     })
     })
     })
     })
     })



     //show store category-----------------------------------------------------------------------------------------
        router.get('/store/:storeId/:request/:c/:k0/:k1/:k2/:k3/:k4',function(req, res) {
             var productSend=[]
             var userId=[req.params.userId]
             var request=req.params.request
             var storeId=req.params.storeId
             var k0 = new RegExp(escapeRegex(req.params.k0), 'gi');
             var k1 = new RegExp(escapeRegex(req.params.k1), 'gi');
             var k2 = new RegExp(escapeRegex(req.params.k2), 'gi');
             var k3 = new RegExp(escapeRegex(req.params.k3), 'gi');
             var k4 = new RegExp(escapeRegex(req.params.k4), 'gi');

             var k0s=6*request
             var k1s=3*request
             var k2s=2*request
             var k3s=2*request
             var k4s=2*request
             var msS=5*request

            Store.findById(storeId,function(err,store){
              store.rank=store.rank+1
              store.save()
            })
             Product.find({$and:[{userSeens:{$nin:userId}},{'store.id':req.params.storeId},{'mainCategory':req.params.c},{'nameKurdish':k0}]}).sort({ "created": -1 }).skip(k0s).limit(6).exec(function(err,k0r){
                 if(err) throw err
                 if(k0r.length>0){
                 for(var i=0;i<k0r.length;i++){
                     productSend.push(k0r[i])
                 }
                 }
                 Product.find({$and:[{userSeens:{$nin:userId}},{'store.id':req.params.storeId},{'mainCategory':req.params.c},{'nameKurdish':k1}]}).sort({ "created": -1 }).skip(k1s).limit(3).exec(function(err,k1r){
                 if(err) throw err
                 if(k1r.length>0){
                 for(var i=0;i<k1r.length;i++){
                     productSend.push(k1r[i])
                 }
                 }
                 Product.find({$and:[{userSeens:{$nin:userId}},{'store.id':req.params.storeId},{'mainCategory':req.params.c},{'nameKurdish':k2}]}).sort({ "created": -1 }).skip(k2s).limit(2).exec(function(err,k2r){
                 if(err) throw err
                 if(k2r.length>0){
                 for(var i=0;i<k2r.length;i++){
                     productSend.push(k2r[i])
                 }
                 }
                Product.find({$and:[{userSeens:{$nin:userId}},{'store.id':req.params.storeId},{'mainCategory':req.params.c},{'nameKurdish':k3}]}).sort({ "created": -1 }).skip(k3s).limit(2).exec(function(err,k3r){
                 if(err) throw err
                 if(k3r.length>0){
                 for(var i=0;i<k3r.length;i++){
                     productSend.push(k3r[i])
                 }
                 }
                 Product.find({$and:[{userSeens:{$nin:userId}},{'store.id':req.params.storeId},{'mainCategory':req.params.c},{'nameKurdish':k4}]}).skip(k4s).sort({ "created": -1 }).limit(2).exec(function(err,k4r){
                  if(err) throw err
                  if(k4r.length>0){
                  for(var i=0;i<k4r.length;i++){
                      productSend.push(k4r[i])
                  }
                  }


                   Product.find({$and:[{userSeens:{$nin:userId}},{'store.id':req.params.storeId},{'mainCategory':req.params.c}]}).sort({ "created": -1 }).skip(msS).limit(5).exec(function(err,ms){
                    if(err) throw err
                    if(ms.length>0){
                    for(var i=0;i<ms.length;i++){
                        productSend.push(ms[i])
                    }
                  }else{
                    Product.find({$and:[{'store.id':req.params.storeId},{'mainCategory':req.params.c}]}).exec(function(err,products){
                 if(err) throw err
               for(var i=0;i<products.length;i++){
                       products[i].userSeens = products[i].userSeens.filter(function(item) {
                       return item !== req.params.userId
                    })
                    products[i].save()

                 }
                 })
                  }



                 res.send(productSend)
            })

        })
        })
        })
        })
        })
        })








   //Post User Seens--------------------------------------------------------------------------------------
      router.post('/productSeen',function(req, res) {
            req.body.products.forEach(function(item){
                if(item){
              Product.findById(item.productId,function(err, product) {
                if(err) throw err
                product.userSeens.push(item.userId)
                product.views=product.views+1
                product.save()
                })
               }
          })
      })


//product rank-----------------------------------------------------------------------------
router.get('/productRank/:productId',function(req,res){
  Product.findById(req.params.productId,function(err,product){
    if(err) throw err
    product.rank=product.rank+1
    product.save()
  Store.findById(product.store.id,function(err,store){
    if(err) throw err
    store.rank=store.rank+1
    store.save()

    })
   })
  })

  router.get('/productRankSave/:productId',function(req,res){
    Product.findById(req.params.productId,function(err,product){
      if(err) throw err
      product.rank=product.rank+2
      product.save()
    Store.findById(product.store.id,function(err,store){
      if(err) throw err
      store.rank=store.rank+2
      store.save()
      })
     })
    })

      router.get('/p',function(req, res) {
          Product.find({'created':{'$lt':Date.now()-7*24*60*60000}},function(err,products){
              if(err) throw err
               products.forEach(function(product){
                product.rank=product.rank/2
                product.save()
               })
          })
      })


     function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


     router.post('/deleteProduct',function(req,res){
           Product.findByIdAndRemove(req.body.productId,function(err){
             if(err) throw err
              res.send('success')
           })
     })


    router.get('/showProduct/:productId',function(req,res){
    Product.findById(req.params.productId,function(err,product){
      res.render('showProduct',{product:product})
    })
    })



     router.get('/search/:search',function(req,res){

       var data=[]
       var search = new RegExp(escapeRegex(req.params.search), 'gi');
        Product.find({$or:[{'nameKurdish':search},{'nameArabic':search},{'nameEnglish':search}]}).sort({"created":-1}).exec(function(err,products){
        products.forEach(function(product){
          if(/^[a-zA-Z0-9- ]*$/.test(req.params.search) == false) {
            data.push(product.nameKurdish)
          }else{
            data.push(product.nameEnglish)
          }
        })
        Store.find({'storeName':search},function(err,stores){
          stores.forEach(function(store){
            data.push(store.storeName)
          })

        data = data.filter((x, i, a) => a.indexOf(x) == i)
        if (data.length > 10) data.length = 10;

        res.send(data)
        })
           })
     })

     router.get('/:request/searchResults/:search',function(req,res){
       var data=[]
         var skip=req.params.request*10
       var search = new RegExp(escapeRegex(req.params.search), 'gi');
        Product.find({$or:[{'nameKurdish':search},{'nameArabic':search},{'nameEnglish':search}]}).sort({created:-1}).skip(skip).limit(10).exec(function(err,products){
        products.forEach(function(product){
          data.push(product)
        })
        Store.find({'storeName':search}).skip(skip).limit(10).exec(function(err,stores){
          stores.forEach(function(store){
            data.push(store)
          })
        res.send(data)
        })
      })
    })


 module.exports=router;
