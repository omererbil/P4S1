var express               =require("express"),
    app                   =express(),
    mongoose              =require("mongoose"),
    bodyParser            =require("body-parser"),
    Agenda            =require("agenda"),
    methodoverride        = require("method-override"),
    compression=require("compression"),
     http = require('http').Server(app),
     Product=require("./models/products"),
      path = require('path');
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());





//---------------------------------------------------------------------------
         //auth confige

         app.use(compression())
    app.use(bodyParser.urlencoded({extended: true}));
    app.set('view engine', 'ejs')

    //-----------------------------------------------------------------------





    //-----------------------------------------------------------------------
    mongoose.Promise = global.Promise;
     mongoose.connect("mongodb://localhost/db12",{useMongoClient: true})
     const mongoConnectionString = 'mongodb://127.0.0.1/db12';
    //mongoose.connect("mongodb://govan:omererbil0@ds227939.mlab.com:27939/marseentest",{useMongoClient: true})
    var agenda = new Agenda({db: {address: mongoConnectionString}});

     agenda.define('reduce ranks', {priority: 'high', concurrency: 1}, function(job, done) {
       Product.find({'created':{'$lt':Date.now()-10*24*60*60000}},function(err,products){
           if(err) throw err
            products.forEach(function(product){
             product.rank=product.rank/2
             product.save()
            })
       })
   })
  done(); // dont forget to call done!
});

agenda.on('ready', function() {
  agenda.every('14400 minutes', 'reduce ranks');
  agenda.start();
});
    //------------------------------------------------------------------


    app.use(express.static("public"));
    app.use(methodoverride("_method"));



     var storesRoutes=require("./routes/stores")
      app.use("/",storesRoutes);


     var productRoutes=require("./routes/products")
      app.use("/",productRoutes);



    //-------------------------------------------------------------------------------

   http.listen(8163,function(){
    console.log("server has started")
})
