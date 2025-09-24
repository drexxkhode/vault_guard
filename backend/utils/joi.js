module.exports = (schema) =>{
    return (req, res, next) =>{
        const {error} = schema.validate(req.body, {
abortEarly: false,
stripUnknown : true
        });
        if (error){
            const message = process.env.NODE_ENV === "production" ? 
            "Invalid request data" : error.details.map(d =>d.message).join(", ");
             return res.status(400).json({error : message });
        }
        next();
    };
};