var mongoose=require("mongoose");


var ProductsSchema=new mongoose .Schema({
        nameKurdish:String,
        nameArabic:String,
        nameEnglish:String,
        price:String,
        currency:String,
        mainCategory:String,
        originalCategory:String,
        discountPrice:{type:Number,default:0},
        discountPeriod:{type:Number,default:0},
        discountAll:{type:Number,default:0},
        images:[String],
        spesifications:String,
        created: {type: Date, default: Date.now},
        views:{type:Number,default:0},
        rank:{type:Number,default:0},
        sponser:{type:Number,default:10},
        sponserInside:{type:Number,default:10},
        discount:{type:Number,default:0},
        gender:{type:Number,default:1},
        store:{
                id:String,
                city:String,
                storeName:String,
                location:{
                latitude:Number,
                longitude:Number
              },
                phone:Number,
        },
        userSeens:[String]

});


module.exports=mongoose.model("Product",ProductsSchema)
