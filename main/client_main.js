// 
// DONT REMOVE
// 
const PDF_UINT8_ARRAY_$8539084 = new Uint8Array([])
import { getDocument, GlobalWorkerOptions } from "./pdf.mjs"

// src/main.js
GlobalWorkerOptions.workerSrc = "./blah, i get overwritten anyways"
try {
    var pdf = await getDocument({ data: PDF_UINT8_ARRAY_$8539084 }).promise
    var textContents = [];
    var numPages = pdf.numPages;
    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        textContents[pageNumber - 1] = pdf.getPage(pageNumber).then((page) => page.getTextContent())
    }
    textContents = await Promise.all(textContents)
    globalThis.pdfTextContents = JSON.stringify(textContents)
    resolve()
} catch (err) {
    globalThis.pdfError = err.stack
    resolve()
}
globalThis.promiseResoved = true