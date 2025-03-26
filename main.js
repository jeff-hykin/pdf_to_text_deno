#!/usr/bin/env -S deno run --allow-all
import { launch } from "https://esm.sh/jsr/@astral/astral@0.5.2"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.7.6/main/file_system.js"
import stringForIndexBundledHtml from "./main/index.bundled.html.binaryified.js"
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

import uint8ArrayForTestPdfPdf from "./test_data/test_pdf.pdf.binaryified.js"

export class PdfToText {
    constructor({port=6060, hostIp, shouldWarn = true} = {}) {
        // spinup server and browser
        this.port = port
        this.shouldWarn = shouldWarn
        
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
        let addr
        while (this.port < 10000) {
            try {
                addr = `${hostIp||hostIps[0]}:${this.port}`
                this.abortController = new AbortController()
                this.server = Deno.serve(
                    { signal: this.abortController.signal, port: this.port, hostname: hostIps[0], onListen: ()=>{}  },
                    (req) => req?.url?.endsWith?.("/ping") ? new Response("pong") : new Response(stringForPdfExtractionHtml, { headers: { "Content-Type": "text/html" } }),
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
                    const response = await (await fetch(`http://${addr}/ping`)).text()
                    if (response == "pong") {
                        resolve()
                    }
                } catch (error) {}
                break
            }
        })
        this.pagePromise = this.serverRunningPromise.then(()=>this.browserPromise.then((browser) => browser.newPage(`http://${this.addr}/`)))
    }

    async convert(pdfData, {tryCap = 10,} = {}) {
        pdfData = pdfData || uint8ArrayForTestPdfPdf
        const stringForPdfExtractionHtml = stringForIndexBundledHtml.replace(/PDF_UINT8_ARRAY_\$8539084 = new Uint8Array\(\[\]\)/, `PDF_UINT8_ARRAY_$8539084 = new Uint8Array([${uint8ArrayForTestPdfPdf}])`)
        const page = await this.pagePromise
        var value
        let tries = 0
        while (value == null) {
            tries++
            value = await page.evaluate(() => document.body.innerHTML)
            try {
                value = JSON.parse(value)
            } catch (error) {
                this.shouldWarn && console.warn(`error when trying to parse value as json`, value)
            }
            if (tries > tryCap) {
                this.shouldWarn && console.warn(`giving up, tried ${tryCap}`)
                break
            }
        }
        return value
    }

    close() {
        this.abortController.abort()
        return this.server.finished
    }
}

export async function pdfToText({ pdfData }) {
    const pdfToText = new PdfToText()
    const result = await pdfToText.convert(pdfData)
    await pdfToText.close()
    return result
}
