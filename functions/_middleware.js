/**
 * @file _middleware.js
 * @author cwxiaos, 
 * @brief In this file, we will preprocess requests
 * @version 0.1
 * @date 2024-05-15
 * 
 * @copyright Copyright (c) 2024
 * 
 */

export async function onRequest(context) {
    try {
        const {request} = context
        const {pathname} = new URL(request.url)
        const path = pathname.split('/')[1]

        console.log(path)

        // Avoid some files being accessed directly as static assets
        const blackList = [
            // By order, make it more easy to verify list
            '.wrangler',
            'assets',
            'functions',
            'node_moudles',
            '.gitignore',
            'README.md',
            'wrangler.toml',
        ]

        if(blackList.includes(path)) {
            const url = new URL(request.url)
            url.pathname = '/'
            return new Response(`Redirecting to: ${url.href}`, {
                status: 301,
                headers: {
                    Location: url.href
                }
            })
        }

        // Public static assets can be accessed directly
        const whiteList = [
            'static',
        ]
        if(whiteList.includes(path)) {
            return await context.next()
        }

        // Now we will validate authorization for protected routes
        // TODO


        return await context.next()
    } catch (err) {
        return new Response(`${err.message}\n${err.stack}`, { status: 500 })
    }
  }