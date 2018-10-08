'use strict'
module.exports = {
    header: {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    },
    api: {
        base: "http://rap2api.taobao.org/app/mock/86092/",
        creations: "api/creations",
        comment: "api/comments",
        up: "api/up"
    }
}