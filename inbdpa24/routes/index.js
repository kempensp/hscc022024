var express = require('express');
var router = express.Router();
const auth = require("../middleware/verifyToken");
const myGetRestCall=require("../middleware/RestAPIGet");

/* GET home page. */
router.get('/', auth, function(req, res, next) {
  //Call the stats API endpoint to get user and opportunity count and store it locally
  const url = 'https://inbdpa.api.hscc.bdpa.org/v1/info';
  const token = process.env.BEARER_TOKEN;
  myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
        //console.log("REST CALL ", data);
        if (data.success){
            var opportunities=data.info.opportunities;
            var users=data.info.users;
            //Set up MongoDB connection
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
                console.log("Opportunities=",opportunities);
                //Defining db and collection objects to simplify code
                const db = client.db('inBDPA24');
                const collection = db.collection('Stats');
                console.log("test stats collection");
                //Try to store users and opportunities in Stats Collection
                const updateStats=collection.updateOne(
                  {title:"inBDPAstats"},
                  {$set:
                    {
                      title:"inBDPAstats",
                      opportunityCount:opportunities,
                      userCount:users
                    }
                  },
                  {upsert:true}
                )
                

                // Find the first document in the collection

            } finally {
                // Ensures that the client will close when you finish/error
                //await client.close();
            }
            }
            run().catch(console.dir);
 
        } // closes if statement
        else{

        }
    }) // data then component
    .catch(error => console.error(error));



  res.render('index', { 
    title: 'BDPA Milwaukee',
    id: res.locals.user_id,
    role: res.locals.role,
    name: res.locals.name
  });
});

module.exports = router;

// UPDATED WITH RENDERING TOKEN INFO 4/6/24
