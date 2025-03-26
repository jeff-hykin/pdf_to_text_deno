// 
// DONT REMOVE
// 
const PDF_UINT8_ARRAY_$8539084 = new Uint8Array([])
import { getDocument, GlobalWorkerOptions } from "./pdf.mjs"

// src/main.js
GlobalWorkerOptions.workerSrc = "./blah, i get overwritten anyways"
var pdf = await getDocument({ data: PDF_UINT8_ARRAY_$8539084 }).promise
// I'm using this cause I know astral can read it
// TODO: just have it read globalThis.value
document.body.innerHTML = JSON.stringify(await new Promise(async (resolve,reject)=>{
    try {
        var textContents = [];
        var numPages = pdf.numPages;
        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
            textContents[pageNumber - 1] = pdf.getPage(pageNumber).then((page) => page.getTextContent())
        }
        resolve(await Promise.all(textContents))
    } catch (err) {
        reject(err)
    }
}))