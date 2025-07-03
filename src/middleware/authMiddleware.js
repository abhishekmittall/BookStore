import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    if (process.env.SKIP_AUTH === "true") return next();

    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // If token doesn't start with Bearer, prepend it
    if (!token.startsWith("Bearer ")) {
        token = "Bearer " + token;
    }

    try {
        const jwtToken = token.split(" ")[1]; // extract actual token
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET || "yourSuperSecretKeyHere");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token." });
    }
};