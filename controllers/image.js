// --------------------------(Adding security key -Changing CLarifai api to back-end to keep it safe- )----------------------------------------------+++

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

//  Used this ---VVVV----- to figure out face-detect-model number in clarifai...
// const Clarifai = require("clarifai");
// console.log(Clarifai)

// ___________________________________________

const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
// ___________________________________________
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + process.env.PAT);

const handleApiCall = (req, res) => {
    
    console.log(req.body.input)
    
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": process.env.USER_ID,
                "app_id": process.env.APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: req.body.input, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }
            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }

            // Since we have one input, one output will exist here
            const output = response.outputs[0];
            console.log(response.outputs[0])
    
            console.log("Predicted concepts:");
            for (const concept of output.data.concepts) {
                console.log(concept.name + " " + concept.value);
            }
            res.json(response);
        }
    );
  }

// ------------------------------------------------------------------------+++


const handleImage = (req, res, db) => {
    // ------------------------------------------------------------------------+++
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++
    //         //  (In case you are using version 1.0.0 or higher of Knex.js) res.json(entries[0].entries);
    //         return res.json(user.entries);
    //     } 
    // })
    // if (!found){
    //     res.status(400).json('not found');
    // }
    // ------------------------------------------------------------------------+++

    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries =>{
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
};

// export default {handleImage, handleApiCall};
