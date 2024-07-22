const ERROR_CODES = {
    BAD_REQUEST: 400, 
    FORBIDDEN: 403, 
    NOT_FOUND: 404, 
    SERVER_ERROR: 500, 
}

const ERROR_MESSAGES = {
    BAD_REQUEST: "the server cannot or will not process the request due to something that is perceived to be a client error ", 
    FORBIDDEN: "This is a permissions issue",
    NOT_FOUND: "a server response that indicates the requested page could not be found", 
    SERVER_ERROR: "the server is unable to fulfill a request due to an unexpected condition or configuration issue" , 
}

module.exports = {
    ERROR_CODES, 
    ERROR_MESSAGES,
}