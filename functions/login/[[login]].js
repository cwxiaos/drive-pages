/**
 * @file [[login]].js
 * @author cwxiaos, 
 * @brief Page for login
 * @version 0.1
 * @date 2024-05-16
 * 
 * @copyright Copyright (c) 2024
 * 
 */

import {DatabaseAuth} from "../private/database"

import page_login from '../../assets/login.html'

export async function onRequest(context){
    return handleRequest(context)
}

async function handleRequest(context) {
    const {request} = context
    const cookie = request.headers.get('cookie')

    if (cookie) {
        const databaseAuth = new DatabaseAuth(context.env)
        if (await databaseAuth.validateSession(cookie)) {
            const url = new URL(request.url)
            url.pathname = '/drive'
            return new Response(`Redirecting to: ${url.href}`, {
                status: 301,
                headers: {
                    Location: url.href
                }
            })
        }
    }

    return new Response(page_login, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
        }
    })
}