/**
 * @file utils.js
 * @author cwxiaos, 
 * @brief Utils
 * @version 0.1
 * @date 2024-05-16
 * 
 * @copyright Copyright (c) 2024
 * 
 */

export default class Util {
    constructor() {
        this.getTimestamp = () => {
            return Math.floor(Date.now() / 1000)
        }

        this.newShortUUID = (length) => {
            const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            const randomValues = crypto.getRandomValues(new Uint8Array(length))

            let customUUID = ''
            
            for (let i = 0; i < length; i++) {
                customUUID += characters[61 & randomValues[i]]
            }
            return customUUID
        }
    }
}