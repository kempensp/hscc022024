var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
const myIncrementRestCall = require("../middleware/RestAPIIncrement");
const auth = require("../middleware/verifyToken");
var store = require('store');
var MarkdownIt = require('markdown-it'),
md = new MarkdownIt();
//including middleware

router.get('/', auth, function(req,res,next) {
    if ((res.locals.role) && (res.locals.role != 'guest')){
    const url = 'https://inbdpa.api.hscc.bdpa.org/v1/opportunities';
    const token = process.env.BEARER_TOKEN;
    //console.log(url); //Debug

    // Pass url and token into RestAPIGet and pull information from response
    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
        //console.log("REST CALL ", data);
        if (data.success){
            // SUBJECT TO CHANGE
            //console.log(data);
            //console.log(data.opportunities);
            var opportunitylist=data.opportunities;
            //console.log(opportunitylist);
            //console.log(opportunitylist.length);
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
                const db = client.db('inBDPA24');
                const collection = db.collection('OpportunitiesIndex');
                //Try to store list in mongodb???
                
                for (var i=0; i<opportunitylist.length; i++)
                {
                    const update= await collection.updateOne( 
                        { opportunityindex: i+1 }, 
                        {
                          $set: 
                            {
                              opportunityindex: i+1,
                              mongoIndex: opportunitylist[i].opportunity_id
                            }
                        }, 
                        { upsert: true }
                      )
                }

                // Find the first document in the collection
                const first = await collection.findOne();
                console.log(first);
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close();
            }
            }
            run().catch(console.dir);


            //Get the count of the number of opportunities for pagination
            var opportunityCount=store.get('opportunities').count;

            res.render('getopportunities', { 
                title: 'inBDPA Stats' , 
                opportunities:opportunitylist,
                opportunitystart: 0,
                id: res.locals.user_id,
                role: res.locals.role,
                name: res.locals.name,
                opportunityCount: opportunityCount
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
}
    else{
        res.redirect('/login');
    }
}); // close router.get general route
router.get('/start=:startid', auth, function(req,res,next) {
    var url = 'https://inbdpa.api.hscc.bdpa.org/v1/opportunities'; //Set base url 
    var opportunityCount=0;

    var afteropportunityid=req.params.startid; //Attempt to get userid from indexvalue
    //Look up the opportunity id that we go AFTER in our url
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
        const collection = db.collection('OpportunitiesIndex');
        //Find after id for API call using mongo
        console.log(afteropportunityid);
        const query={opportunityindex:Number(afteropportunityid)};
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
            var opportunitylist=data.opportunities;
            async function run() {
                try {
                    await client.connect();
                    // Send a ping to confirm a successful connection
                    await client.db("admin").command({ ping: 1 });
                    console.log("Pinged your deployment. You successfully connected to MongoDB!");
                    const db = client.db('inBDPA24');
                    const collection = db.collection('OpportunitiesIndex');
                    console.log("Opportunitylist length",opportunitylist.length);
                    console.log(afteropportunityid+opportunitylist.length);
                    for (var i=afteropportunityid; i<(Number(opportunitylist.length)+Number(afteropportunityid)); i++)
                    {
                        //console.log(i)
                        //Revise 4/20 with upsert code
                        const upsert=await collection.updateMany(
                            {opportunityindex:i+1},
                            {$set:
                                {
                                    opportunityindex: i+1,
                                    mongoIndex: opportunitylist[i-afteropportunityid].opportunity_id
                                }
                            
                            },
                            {upsert:true}

                        );
                    }
                    const usercol= db.collection("Stats")
                    const statslookup=await usercol.findOne();
                    userCount=statslookup.userCount;
                    console.log(statslookup);
                }
            
            finally {
                // Ensures that the client will close when you finish/error
                await client.close();
            }
            }
            run().catch(console.dir);

            //Get the count of the number of opportunities for pagination
            var opportunityCount=store.get('opportunities').count;

            res.render('getopportunities', { 
                title: 'inBDPA Stats' , 
                opportunities:opportunitylist,
                opportunitystart: 0,
                id: res.locals.user_id,
                role: res.locals.role,
                name: res.locals.name,
                opportunityCount: opportunityCount
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

});
// GET route for a specific user (based on username)
router.get('/:opportunity_id', auth, function(req,res,next) {
    //Set up API call
    const url = 'https://inbdpa.api.hscc.bdpa.org/v1/opportunities/' + req.params.opportunity_id;
    const token = process.env.BEARER_TOKEN;
    // Pass url and token into RestAPIGet and pull information from response
    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
    console.log('REST CALL',data);
    if (data.success){
        // SUBJECT TO CHANGE
        var opportunityid=req.params.opportunity_id;
        var creatorid=data.opportunity.creator_id;
        var views=data.opportunity.views;
        var title=data.opportunity.title;
        var contents=md.render(data.opportunity.contents);
        var created=data.opportunity.createdAt;
        var updated=data.opportunity.updatedAt;


        const idurl='https://inbdpa.api.hscc.bdpa.org/v1/opportunites/' + opportunityid;

        console.log(idurl);

        myIncrementRestCall.incrementWithBearerToken(idurl, token);
        res.render('viewopportunity', 
        {title: 'User profile', 
        opptitle: title,
        oppid: opportunityid,
        views: views+1,
        creatorid: creatorid,
        contents:contents,
        createdAt:created,
        updatedAt:updated,
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


});

module.exports = router;