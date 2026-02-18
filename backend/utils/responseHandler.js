
const response = (res, statusCode, message, data = null,errors = null) => {
    const responseObject = {
        success: statusCode < 400,
        message,
        data,
        errors
    };
    
    return res.status(statusCode).json(responseObject);
};

export default response; 