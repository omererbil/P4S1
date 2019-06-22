var mongoose=require("mongoose");


var StoresSchema=new mongoose .Schema({
        storeName:String,
        profileImage:String,
        categories:[{labelKurdish:String,value:String}],
        phone:String,
        country:String,
        city:[String],
        views:Number,
        openTime:String,
        productSeens:Number,
        rank:{type: Number, default:0},
        sponser:{type:Number,default:0},
        note:String,
        Discounts:{type: Number, default:0},
        newProducts:{type: Number, default:0},
        adminKey:String,
        location:{longitude:Number,latitude:Number},
        created: {type: Date, default: Date.now},
        author:{
                id:String,
                phone:Number,

               },
        products:[{
                product:{type:mongoose.Schema.Types.ObjectId, ref:'Product'},
                created:Date
                 }],

        messages:[{
               id:{ type:mongoose.Schema.Types.ObjectId, ref:'Message'}
                 }],
        favourites:{type:Number,default:0},
        product_catagory:[String],
        admines:[{name:String,myPhone:String}],
        note:String
})




module.exports=mongoose.model("Store",StoresSchema)
