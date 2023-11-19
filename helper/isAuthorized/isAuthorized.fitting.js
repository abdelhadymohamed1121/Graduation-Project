const jwt = require("jsonwebtoken");

module.exports = () => {
    return async (req, res, next) => {
        try {
            if (req.headers.authorization) {
                let bareToken = req.headers.authorization;
                let token = bareToken.split(" ")[1];
                var decoded = jwt.verify(token, process.env.SECRET_KEY);
                req.user = decoded;
                if (req.user.id) {
                    next();
                }
                else {
                    return res.status(401).json({ status:401 ,message: "unauthorized" });
                }
            }
            else if (!req.headers.authorization) {
                return res.status(401).json({ status:401 ,message: "unauthorized" });
            }
        } catch (error) {
            if(error.message == "invalid signature"){
                return res.status(401).json({ status:401 ,message: "unauthorized" });
            }
            else{
                return res.status(500).json({status:500,  message: "Something went wrong" , error});
            }
        }

    }
}