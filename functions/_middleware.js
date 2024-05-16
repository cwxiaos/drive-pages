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

import { DatabaseSetup } from "./private/database"

export async function onRequest(context) {
    try {
        const {request} = context
        const {pathname} = new URL(request.url)
        const path = pathname.split('/')[1]

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
            'favicon.ico',
            'robots.txt',
        ]

        if(whiteList.includes(path)) {
            return await context.next()
        }

        // If database is not initialized, redirect to setup
        const databaseSetup = new DatabaseSetup(context.env)
        if (!await databaseSetup.isDatabaseInitialized()) {
            if (path !== 'setup') {
                const url = new URL(request.url)
                url.pathname = '/setup'
                return new Response(`Redirecting to: ${url.href}`, {
                    status: 301,
                    headers: {
                        Location: url.href
                    }
                })
            }
        }


        return await context.next()
    } catch (err) {
        return new Response(`${err.message}\n${err.stack}`, { status: 500 })
    }
  }