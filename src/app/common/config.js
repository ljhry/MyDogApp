'use strict'
module.exports = {
    header: {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    },
    qiniu:{
        upload:'http://upload.qiniu.com'
    },
    api: {
        // base: "http://rap2api.taobao.org/app/mock/86092/",
        base: "http://192.168.137.1:1234/",
        creations: "api/creations",
        comment: "api/comments",
        up: "api/up",
        signup: "api/u/signup",
        verify: "api/u/verify",
        signature:"api/signature",
        update:"api/u/update"
    }
}