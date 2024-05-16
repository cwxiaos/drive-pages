/**
 * @file [[setup]].js
 * @author cwxiaos, 
 * @brief Page for Server Initialization
 * @version 0.1
 * @date 2024-05-15
 * 
 * @copyright Copyright (c) 2024
 * 
 */

import {DatabaseSetup} from '../private/database'

import page_setup from '../../assets/setup.html'

export async function onRequest(context){
    return handleRequest(context)
}

async function handleRequest(context) {
    const {request} = context
    const {searchParams} = new URL(request.url)
    const databaseSetup = new DatabaseSetup(context.env)

    if (await databaseSetup.isDatabaseInitialized()) {
        const url = new URL(request.url)
        url.pathname = '/login'
        return new Response(`Redirecting to: ${url.href}`, {
            status: 301,
            headers: {
                Location: url.href
            }
        })
    }

    const username = searchParams.get("username")
    const password = searchParams.get("password")

    if (username && password) {
        await databaseSetup.setRootUser(username, password)

        const url = new URL(request.url)
        url.pathname = '/login'
        return new Response(`Redirecting to: ${url.href}`, {
            status: 301,
            headers: {
                Location: url.href
            }
        })
    }

    return new Response(page_setup, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
        }
    })
}