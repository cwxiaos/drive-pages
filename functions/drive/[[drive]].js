/**
 * @file [[drive]].js
 * @author cwxiaos, 
 * @brief Page for drive ui main
 * @version 0.1
 * @date 2024-05-16
 * 
 * @copyright Copyright (c) 2024
 * 
 */

import {DatabaseAuth} from "../private/database"

export async function onRequest(context){
    return handleRequest(context)
}

async function handleRequest(context) {
    const {request} = context
    const cookie = request.headers.get('cookie')

    if (cookie) {
        const databaseAuth = new DatabaseAuth(context.env)
        if (await databaseAuth.validateSession(cookie)) {
            return new Response("Drive")
        }
    }

    const url = new URL(request.url)
    url.pathname = '/login'
    return new Response(`Redirecting to: ${url.href}`, {
        status: 301,
        headers: {
            Location: url.href
        }
    })
}