const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided or invalid format." });
        }

        const token = authHeader.split(" ")[1];

        if (!token) return res.status(401).json({ message: "No token provided." });

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedData?.id;

        if (!req.userId) {
            return res.status(401).json({ message: "Invalid token." });
        }

        next();
    } catch (error) {
        console.error("Auth Error:", error.message);
        res.status(401).json({ message: "Invalid Token or Session Expired." });
    }
};

module.exports = auth;