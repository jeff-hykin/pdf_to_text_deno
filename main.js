#!/usr/bin/env -S deno run --allow-all
// zip-js pinned: astral asks for ^2.7.52, and newer zip-js builds on esm.sh no longer export ZipReader
import { launch } from "https://esm.sh/jsr/@astral/astral@0.5.2?deps=@jsr/zip-js__zip-js@2.7.52"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.7.6/main/file_system.js"
import stringForIndexBundledHtml from "./main/index.bundled.html.binaryified.js"
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

import uint8ArrayForTestPdfPdf from "./test_data/test_pdf.pdf.binaryified.js"

export class PdfToTextConverter {
    constructor({port=6060, hostIp, shouldWarn = true} = {}) {
        // spinup server and browser
        this.port = port
        this.shouldWarn = shouldWarn
        this.runningConversion = Promise.resolve()
        
        // NOTE: I should be able to do it without a server, but for some reason astral doesn't work with a file://
        // import { pathToFileURL } from 'node:url'
        // const tempFilePath2 = (await Deno.makeTempFile())+".html"
        // await FileSystem.write({
        //     path: tempFilePath2,
        //     data: stringForPdfExtractionHtml,
        // })
        
        this.browserPromise = launch()
        
        // 
        // server
        // 
        const hostIps = Deno.networkInterfaces()
            .filter((each) => each.family == "IPv4")
            .map((each) => each.address)
            // first ip is usually 127.0.0.1 (localhost)
        this.abortController = new AbortController()
        while (this.port < 10000) {
            try {
                this.addr = `${hostIp||hostIps[0]}:${this.port}`
                this.abortController = new AbortController()
                this.server = Deno.serve(
                    { signal: this.abortController.signal, port: this.port, hostname: hostIps[0], onListen: ()=>{}  },
                    // (req) => new Response(this.stringForPdfExtractionHtml, { headers: { "Content-Type": "text/html" } }),
                    (req) => req?.url?.endsWith?.("/ping") ? new Response("pong") : new Response(this.stringForPdfExtractionHtml, { headers: { "Content-Type": "text/html" } }),
                )
                break
            } catch (error) {
                if (!error.stack.includes("AddrInUse: Address already in use (os error 48)")) {
                    this.shouldWarn && console.warn(`error when trying to start server on port ${this.port}, trying next this.port`, error)
                }
                this.port++
            }
        }
        if (this.port >= 10000) {
            throw new Error(`giving up, tried every port and couldn't start server`)
        }
        // retry until the server answers; a single failed ping used to leave this waiting forever
        this.serverRunningPromise = (async ()=>{
            for (let tries = 0; tries < 100; tries++) {
                try {
                    const response = await (await fetch(`http://${this.addr}/ping`)).text()
                    if (response == "pong") {
                        return
                    }
                } catch (error) {}
                await new Promise((resolve)=>setTimeout(resolve, 100))
            }
            throw new Error(`the local server at ${this.addr} never answered`)
        })()
        this.pagePromise = Promise.resolve().then(()=>this.serverRunningPromise.then(()=>this.browserPromise.then((browser) => browser.newPage())))
    }
    
    async convert(pdfData, {tryCap = 10, timeoutMs = 60_000} = {}) {
        await this.runningConversion.catch(()=>{}) // one conversion at a time: they share the page
        return this.runningConversion = ((async ()=>{
            if (!(pdfData instanceof Uint8Array)) {
                throw new Error(`pdfData must be a Uint8Array`)
            }
            this.stringForPdfExtractionHtml = stringForIndexBundledHtml.replace(/PDF_UINT8_ARRAY_\$8539084 = new Uint8Array\(\[\]\)/, `PDF_UINT8_ARRAY_$8539084 = new Uint8Array([${pdfData}])`)
            // (re)load the page so it picks up this PDF; reusing the page as-is returns the previous result
            const page = await this.pagePromise
            this.conversionCount = (this.conversionCount||0) + 1
            await page.goto(`http://${this.addr}/?conversion=${this.conversionCount}`)
            const deadline = Date.now() + timeoutMs
            while (Date.now() < deadline) {
                const value = await page.evaluate(() => {
                    return {
                        value: JSON.parse(globalThis.pdfTextContents||'null'),
                        error: globalThis.pdfError,
                        promiseResoved: globalThis.promiseResoved,
                    }
                })
                if (value.error) {
                    throw new Error(value.error)
                }
                if (value.promiseResoved) {
                    return value.value
                }
                await new Promise((resolve)=>setTimeout(resolve, 100))
            }
            throw Error(`giving up on getting data out of browser for pdfToText after ${timeoutMs}ms`)
        })())
    }
    
    async close() {
        this.abortController.abort()
        // the browser is a separate process and outlives this one unless closed
        await (await this.browserPromise).close().catch(()=>{})
        return this.server.finished
    }
}

export async function pdfToText(pdfData, {tryCap = 10, timeoutMs} = {}) {
    const pdfToText = new PdfToTextConverter()
    const result = await pdfToText.convert(pdfData, {tryCap, timeoutMs})
    await pdfToText.close()
    return result
}
