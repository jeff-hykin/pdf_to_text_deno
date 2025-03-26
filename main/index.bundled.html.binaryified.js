let output = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
</head>
<body>

<script type="module">// 
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
}))</script>

</body>
</html>
`
const relativePathToOriginal = "index.bundled.html"
try {
    if (relativePathToOriginal && globalThis?.Deno?.readFileSync instanceof Function) {
        const { FileSystem } = await import("https://deno.land/x/quickr@0.6.72/main/file_system.js")
        // equivlent to: import.meta.resolve(relativePathToOriginal)
        // but more bundler-friendly
        const path = `${FileSystem.thisFolder}/${relativePathToOriginal}`
        const current = await Deno.readTextFile(path)
        const original = output
        output = current

        // update the file whenever (no await)
        const thisFile = FileSystem.thisFile // equivlent to: import.meta.filename, but more bundler-friendly
        setTimeout(async () => {
            try {
                const changeOccured = !(current.length == original.length && current.every((value, index) => value == original[index]))
                // update this file
                if (changeOccured) {
                    const { binaryify } = await import("https://deno.land/x/binaryify@2.5.5.0/binaryify_api.js")
                    await binaryify({
                        pathToBinary: path,
                        pathToBinarified: thisFile,
                        forceExportString: true,
                    })
                }
            } catch (e) {
            }
        }, 0)
    }
} catch (e) {
    
}
        
export default output