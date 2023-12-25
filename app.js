const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/mainRoute');
const sequelize=require('./util/database');

var cors = require('cors');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors()); 
app.use(bodyParser.json());



// Use feed routes
app.use('/', userRoutes);
//{force:true}
sequelize.sync().then(result =>{
    console.log(result);
    app.listen(5000);
  
}).catch(err=>{
    console.log(err);
});
/*
const express=require('express');
const sequelize=require('./util/database');
const user=require('./models/user');
const DataCollection=require('./models/dataCollection');
const Data=require('./models/data');
const Alert=require('./models/alert');
const EducationalRes=require('./models/educationalRes');
const CommunityReporting=require('./models/communityReporting');
const Interests=require('./models/interests');
const UserInterest=require('./models/userInterests');
const Location=require('./models/location');
const TempUser=require('./models/tempUser');
const TempUserInterests=require('./models/tempUserInterests');

const createMainData =require('./models/createMainData');



const app=express();

//{force:true}
sequelize.sync().then(result =>{
    console.log(result);
    app.listen(5000);
  
}).catch(err=>{
    console.log(err);
    

});*/