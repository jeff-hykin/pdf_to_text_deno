#!/usr/bin/env -S deno run --allow-all
import { launch } from "https://esm.sh/jsr/@astral/astral@0.5.2"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.7.6/main/file_system.js"
import stringForPdfExtractionHtml from "./pdf_extraction.html.binaryified.js"
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

// NOTE: I should be able to do it without a server, but for some reason astral doesn't work with a file://
// import { pathToFileURL } from 'node:url'
// const tempFilePath2 = (await Deno.makeTempFile())+".html"
// await FileSystem.write({
//     path: tempFilePath2,
//     data: stringForPdfExtractionHtml,
// })

const browserPromise = launch()
let server
let addr
let port = 6060
const hostIps = Deno.networkInterfaces()
    .filter((each) => each.family == "IPv4")
    .map((each) => each.address)

// first ip is usually 127.0.0.1 (localhost)
while (port < 10000) {
    try {
        addr = `${hostIps[0]}:${port}`
        server = serve((req) => new Response(stringForPdfExtractionHtml, { headers: { "Content-Type": "text/html" } }), { port, hostname: hostIps[0] })
        break
    } catch (error) {
        console.warn(`error when trying to start server on port ${port}, trying next port`)
        port++
    }
}

const [ browser, ] = await Promise.all([
    browserPromise,
    new Promise((r) => setTimeout(r, 1000))
])
// var page = await browser.newPage(pathToFileURL(tempFilePath2).href)
var page = await browser.newPage(`http://${addr}/`)
var value
let tries = 0
var tryCap = 10
while (value == null) {
    tries++
    value = await page.evaluate(() => document.body.innerHTML)
    try {
        value = JSON.parse(value)
    } catch (error) {
        console.warn(`error when trying to parse value as json`, value)
    }
    if (tries > tryCap) {
        console.warn(`giving up, tried ${tryCap}`)
        break
    }
}
await server.then((server) => server?.close())
