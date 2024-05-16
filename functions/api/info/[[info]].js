/**
 * @file [[info]].js
 * @author cwxiaos, 
 * @brief Return server info
 * @version 0.1
 * @date 2024-05-15
 * 
 * @copyright Copyright (c) 2024
 * 
 */

export async function onRequest(context) {
    const info = new Info()

    return new Response(JSON.stringify(info), {
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

class Info {
    constructor(){
        this.version = '1.0.0'
        this.authors = [
            'cwxiaos',
        ]
    }
}