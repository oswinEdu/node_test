exports.is_email_address = function (email) {
    var reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
    return reg.test(email);
}


exports.is_china = function(str) {
    var reg = /^[\u4E00-\u9FA5]{2,4}$/;
    return reg.test(str);
}


