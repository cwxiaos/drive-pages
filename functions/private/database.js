/**
 * @file database.js
 * @author cwxiaos, 
 * @brief Database middleware
 * @version 0.1
 * @date 2024-05-16
 * 
 * @copyright Copyright (c) 2024
 * 
 */

import Util from "./utils"

export class DatabaseSetup{
    constructor(env){
        const database = env.database
        const util = new Util()

        database.exec("CREATE TABLE IF NOT EXISTS `authorizations` (`username` TEXT, `password` TEXT, `type` TEXT, `register` INTEGER, `comment` TEXT)")

        this.isDatabaseInitialized = async () => {
            const query = "SELECT * FROM `authorizations` WHERE `type` = 'root'"
            const result = await database.prepare(query).run()
            return result.results.length > 0
        }

        this.setRootUser = async (username, password) => {
            const user = (username || '').replace(/[^a-zA-Z0-9]/g, '') || "_PLACE_HOLDER_"

            const query = "INSERT INTO `authorizations` (`username`, `password`, `type`, `register`, `comment`) VALUES (?, ?, 'root', ?, ?)"
            const result = await database.prepare(query).bind(user, password, util.getTimestamp(), 'Initialization Setup').run()

            return result
        }
    }
}

export class DatabaseAuth{
    constructor(env){
        const database = env.database
        const util = new Util()

        database.exec("CREATE TABLE IF NOT EXISTS `tokens` (`username` TEXT, `token` TEXT, `timestamp` INTEGER)")

        this.validateUser = async (username, password) => {
            const user = (username || '').replace(/[^a-zA-Z0-9]/g, '') || "_PLACE_HOLDER_"
            const query = "SELECT * FROM `authorizations` WHERE `username` = ?"
            const result = await database.prepare(query).bind(user).run()

            if (result.results.length > 0) {
                if (result.results[0].password === password) {
                    return true
                }
            }
            return false
        }

        this.generateToken = async (username) => {
            const token = util.newShortUUID(64)
            const timestamp = util.getTimestamp()

            const checkQuery = "SELECT COUNT(*) as count FROM tokens WHERE username = ?"
            const result = await database.prepare(checkQuery).bind(username).run()
            const count = result.results[0].count

            if (count > 0) {
                const updateQuery = "UPDATE tokens SET token = ?, timestamp = ? WHERE username = ?"
                await database.prepare(updateQuery).bind(token, timestamp, username).run()
            } else {
                const insertQuery = "INSERT INTO tokens (username, token, timestamp) VALUES (?, ?, ?)"
                await database.prepare(insertQuery).bind(username, token, timestamp).run()
            }

            return token
        }

        this.validateSession = async (cookie) => {
            const userToken = cookie.split('=')[1]

            const user = userToken.split(',')[0]
            const token = userToken.split(',')[1]

            const query = "SELECT * FROM `tokens` WHERE `username` = ?"
            const result = await database.prepare(query).bind(user).run()
            
            console.log(result)
            if (result.results.length > 0) {
                if (result.results[0].token === token && util.getTimestamp() - result.results[0].timestamp < 3600) {
                    return true
                }
            }

            return false
        }
    }
}