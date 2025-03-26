#!/usr/bin/env -S deno run --allow-all
import { launch } from "https://esm.sh/jsr/@astral/astral@0.5.2"
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
        this.serverRunningPromise = new Promise(async (resolve, reject)=>{
            while (1) {
                try {
                    const response = await (await fetch(`http://${this.addr}/ping`)).text()
                    if (response == "pong") {
                        resolve()
                    }
                } catch (error) {}
                break
            }
        })
        this.pagePromise = Promise.resolve().then(()=>this.serverRunningPromise.then(()=>this.browserPromise.then((browser) => browser.newPage(`http://${this.addr}/`))))
    }
    
    async convert(pdfData, {tryCap = 10,} = {}) {
        await this.runningConversion // wait for previous conversion to finish (otherwise we'll have problems)
                                     // NOTE: if converting a ton of pdfs, this could definitely be optimized better to run them in parallel
        return this.runningConversion = ((async ()=>{
            if (!(pdfData instanceof Uint8Array)) {
                throw new Error(`pdfData must be a Uint8Array`)
            }
            this.stringForPdfExtractionHtml = stringForIndexBundledHtml.replace(/PDF_UINT8_ARRAY_\$8539084 = new Uint8Array\(\[\]\)/, `PDF_UINT8_ARRAY_$8539084 = new Uint8Array([${uint8ArrayForTestPdfPdf}])`)
            const page = await this.pagePromise
            var value
            let tries = 0
            while (value == null) {
                tries++
                value = await page.evaluate(() => {
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
                if (!value.promiseResoved) {
                    if (tries > tryCap) {
                        throw Error(`giving up on getting data out of browser for pdfToText, tried ${tryCap} times`)
                        break
                    }
                }
            }
            return value
        })())
    }
    
    close() {
        this.abortController.abort()
        return this.server.finished
    }
}

export async function pdfToText(pdfData, {tryCap = 10,} = {}) {
    const pdfToText = new PdfToTextConverter()
    const result = await pdfToText.convert(pdfData, {tryCap})
    await pdfToText.close()
    return result
}
