const recommendationDBClient = require("../../connection/recommendation.db");
const Item = require("../item/item.model");

exports.isExist = async (filter) => {
    let ret = {
        success: false,
        status: 500,
        message: "Something wrong"
    };
    await recommendationDBClient.connect()
        .then(async() => {
            const recommendationDB = await recommendationDBClient.db('Recommendations');
            const collection = await recommendationDB.collection('recommendations');
            let result = await collection.findOne(filter);
            if (result) {
                ret = {
                    success: true,
                    status: 200,
                    message: "Recommendation Exists",
                    Data: result
                }
            }
            else {
                ret = {
                    success: false,
                    status: 400,
                    message: "Recommendation doesn;t Exist"
                }
            }
        })
        .catch((error) => {
            ret = {
                success: false,
                status: 500,
                message: "Something wrong"
            }
        });
        return ret;
}