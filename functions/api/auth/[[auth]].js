/**
 * @file [[auth]].js
 * @author cwxiaos, 
 * @brief API for authorization
 * @version 0.1
 * @date 2024-05-16
 * 
 * @copyright Copyright (c) 2024
 * 
 */

import {DatabaseAuth} from "../../private/database"

export async function onRequest(context) {
    return handleRequest(context)
}

async function handleRequest(context) {
    const {request} = context

    try {
        const contentType = request.headers.get('content-type')
        let requestBody = {}

        if(contentType && contentType.includes('application/x-www-form-urlencoded')){
            const formData = await request.formData()
            formData.forEach((value, key) => {requestBody[key] = value})

            console.log(requestBody)

            const databaseAuth = new DatabaseAuth(context.env)
            const isUserValid = await databaseAuth.validateUser(requestBody.username, requestBody.password)

            if (isUserValid) {
                const token = await databaseAuth.generateToken(requestBody.username)

                return new Response(JSON.stringify({
                    code: 200,
                    message: 'OK',
                }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Set-Cookie': `token=${requestBody.username},${token}; path=/`
                    }
                })
            }
        }

    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({
            code: 500,
            message: 'Internal Server Error',
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}