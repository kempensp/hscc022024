//MODIFY RENDER STATEMENTS TO INCORPORATE AUTH TOKEN INFO!! 4/6/24

//DID I GET A SET OF USERINDICES AND MONGOIDS INTO A MONGODB???

var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
const myIncrementRestCall = require("../middleware/RestAPIIncrement");
const auth = require("../middleware/verifyToken");
//including middleware
var store = require('store');

// Generic route to get a list of users from the beginning (first 100)
router.get('/', auth, function(req,res,next) {
    const url = 'https://inbdpa.api.hscc.bdpa.org/v1/users';
    const token = process.env.BEARER_TOKEN;
    //console.log(url); //Debug
    var userCount=0;
    
    // Pass url and token into RestAPIGet and pull information from response
    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
        console.log("REST CALL ", data);
        if (data.success){
            // SUBJECT TO CHANGE
            var userlist=data.users;

            //TRYING TO STORE INFO INTO MONGO
            const { MongoClient, ServerApiVersion } = require('mongodb');
            const uri = "mongodb+srv://" + process.env.MONGO_LOGIN + "@inbdpa23.dmklbqg.mongodb.net/?retryWrites=true&w=majority&appName=inBDPA23";
            // Create a MongoClient with a MongoClientOptions object to set the Stable API version
            const client = new MongoClient(uri, {
                serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
                }
            });
            async function run() {
            try {
                // Connect the client to the server	(optional starting in v4.7)
                await client.connect();
                // Send a ping to confirm a successful connection
                await client.db("admin").command({ ping: 1 });
                console.log("Pinged your deployment. You successfully connected to MongoDB!");
                
                //Defining db and collection objects to simplify code
                const db = client.db('inBDPA24');
                const collection = db.collection('UserIndex');

                //Try to store list in mongodb???
                
                for (var i=0; i<userlist.length; i++)
                {
                    //Modified 4/20 to update user with upsert tool
                    const updateuser=await collection.updateMany(
                        {userindex:i+1},
                        {$set:
                            {userindex: i+1,
                            mongoIndex: userlist[i].user_id}
                        
                        },
                        {upsert:true}
                    )
                }

                // Find the first document in the collection
                const first = await collection.findOne();
                
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close();
            }
            }
            run().catch(console.dir);
            // Get the count of the number of users from store
            var userCount= store.get('users').count;

            res.render('getusers', { 
                title: 'inBDPA Stats' , 
                users: userlist,
                userstart: req.params.startid,
                id: res.locals.user_id,
                role: res.locals.role,
                name: res.locals.name,
                userCount: userCount,
            });
        } // closes if statement
        else{
            res.render('error', {title: 'Stats call failed', 
            message: data.error,
            id: res.locals.user_id,
            role: res.locals.role,
            name: res.locals.name
        });
        }
    }) // data then component
    .catch(error => console.error(error));
}); // close router.get general route

router.get('/start=:startid', auth, function(req,res,next) {
    var url = 'https://inbdpa.api.hscc.bdpa.org/v1/users';
    //console.log(url); //Debug
    var userCount=0;

    var afteruserid=req.params.startid; //Attempt to get userid from indexvalue
    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb+srv://" + process.env.MONGO_LOGIN + "@inbdpa23.dmklbqg.mongodb.net/?retryWrites=true&w=majority&appName=inBDPA23";
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
        serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        }
    });
    async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const db = client.db('inBDPA24');
        const collection = db.collection('UserIndex');
        //Find after id for API call using mongo
        console.log(afteruserid);
        const query={userindex:Number(afteruserid)};
        console.log(query);
        const object=await collection.findOne(query);
        console.log(object);
        console.log(object.mongoIndex);
        url+="?after="+object.mongoIndex;
        console.log(url);
        const token = process.env.BEARER_TOKEN;
        //WILL MODIFY WITH AFTER ID!
    // Pass url and token into RestAPIGet and pull information from response
    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
        //console.log("REST CALL ", data);
        if (data.success){
            // SUBJECT TO CHANGE
            var userlist=data.users;
            async function run() {
                try {
                    await client.connect();
                    // Send a ping to confirm a successful connection
                    await client.db("admin").command({ ping: 1 });
                    console.log("Pinged your deployment. You successfully connected to MongoDB!");
                    const db = client.db('inBDPA24');
                    const collection = db.collection('UserIndex');
                    console.log("Userlist length",userlist.length);
                    console.log(afteruserid+userlist.length);
                    for (var i=afteruserid; i<(Number(userlist.length)+Number(afteruserid)); i++)
                    {
                        //console.log(i)
                        //Revise 4/20 with upsert code
                        const upsert=await collection.updateMany(
                            {userindex:i+1},
                            {$set:
                                {
                                    userindex: i+1,
                                    mongoIndex: userlist[i-afteruserid].user_id
                                }
                            
                            },
                            {upsert:true}

                        );
                    }

                }
            
            finally {
                // Ensures that the client will close when you finish/error
                await client.close();
            }
            }
            run().catch(console.dir);
            var userCount=store.get('users').count
            
            res.render('getusers', { 
                title: 'inBDPA Stats' , 
                users: userlist,
                userstart: req.params.startid,
                id: res.locals.user_id,
                role: res.locals.role,
                name: res.locals.name,
                userCount: userCount,

            });
        } // closes if statement
        else{
            res.render('error', {title: 'Stats call failed', 
            message: data.error,
            id: res.locals.user_id,
            role: res.locals.role,
            name: res.locals.name
        });
        }
    }) // data then component
    .catch(error => console.error(error));
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    }
    run().catch(console.dir);

    
    


    
}); // close router.get general route

// GET route for a specific user (based on username)
router.get('/:username', auth, function(req,res,next) {
    const url = 'https://inbdpa.api.hscc.bdpa.org/v1/users/' + req.params.username;
    const token = process.env.BEARER_TOKEN;

    //console.log(url); //Debugging code to test url; I'll comment it out once it works

    // Pass url and token into RestAPIGet and pull information from response
    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
        console.log('REST CALL',data);
        if (data.success){
            // SUBJECT TO CHANGE
            var username=data.user.username;
            var usertype=data.user.type;
            var views=data.user.views;
            var aboutsection=data.user.sections.about;
            var educationsection=data.user.sections.education;
            var experiencesection=data.user.sections.experience;
            var skillssection=data.user.sections.skills;
            var volunteeringsection=data.user.sections.volunteering;
            var userid=data.user.user_id;

            const idurl='https://inbdpa.api.hscc.bdpa.org/v1/users/' + userid;

            console.log(idurl);

            myIncrementRestCall.incrementWithBearerToken(idurl, token);
            res.render('userprofile', 
            {title: 'User profile', 
            username: username,
            type: usertype,
            views: views+1,
            about: aboutsection,
            education: educationsection,
            experience: experiencesection,
            skills: skillssection,
            volunteering: volunteeringsection,
            id: res.locals.user_id,
            role: res.locals.role,
            name: res.locals.name
            }); //closes res.render statement



        } // closes if statement
        else{
            res.render('error', {title: 'User call failed',
            message: data.error,
            id: res.locals.user_id,
            role: res.locals.role,
            name: res.locals.name
        });
        }


    }) // data then component
    .catch(error => console.error(error));



}); // close router.get username route





module.exports=router;
    





