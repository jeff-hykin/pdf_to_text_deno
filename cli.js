#!/usr/bin/env -S deno run --allow-all
import { Command } from "jsr:@cliffy/command@1.0.0-rc.7"
import { PdfToTextConverter } from "./main.js"

function fail(message) {
    console.error(`pdf_to_json: ${message}`)
    Deno.exit(1)
}

async function pdfsUnder(folder) {
    const found = []
    for await (const entry of Deno.readDir(folder)) {
        const path = `${folder.replace(/\/+$/, "")}/${entry.name}`
        if (entry.isDirectory) {
            found.push(...await pdfsUnder(path))
        } else if (entry.isFile && /\.pdf$/i.test(entry.name)) {
            found.push(path)
        }
    }
    return found.sort()
}

// One string per page, with a line break wherever PDF.js marks the end of a line.
function pageText(page) {
    return page.items.map((item) => item.str + (item.hasEOL ? "\n" : "")).join("")
}

await new Command()
    .name("pdf_to_json")
    .version("0.1.1.0")
    .description(
        "Extract the text of PDFs as JSON. With one PDF the JSON goes to stdout (or --output); " +
            "with several, or a folder (every PDF under it, subfolders included), each is written " +
            "next to its PDF as <name>.json (or into --out-dir).",
    )
    .arguments("<paths...:file>")
    .option("-o, --output <path:file>", "Write the JSON here instead of stdout (one PDF only)")
    .option("-d, --out-dir <dir:file>", "Write each <name>.json into this folder")
    .option("-t, --text", "Plain text per page ([{ page, text }]) instead of PDF.js text items")
    .option("-c, --compact", "No indentation")
    .action(async (options, ...paths) => {
        // A folder stands for every PDF under it, each converted to a .json beside it.
        const pdfs = []
        let fromFolder = false
        for (const path of paths) {
            const info = await Deno.stat(path).catch(() => null)
            if (!info) {
                fail(`no such file or folder: ${path}`)
            }
            if (info.isDirectory) {
                fromFolder = true
                pdfs.push(...await pdfsUnder(path))
            } else {
                pdfs.push(path)
            }
        }
        if (pdfs.length === 0) {
            fail(`no PDFs found in ${paths.join(", ")}`)
        }
        const batch = pdfs.length > 1 || fromFolder
        if (options.output && batch) {
            fail("--output takes one PDF; use --out-dir for several")
        }
        const converter = new PdfToTextConverter({ shouldWarn: false })
        const failed = []
        try {
            for (const pdf of pdfs) {
                let pages
                try {
                    pages = await converter.convert(await Deno.readFile(pdf))
                } catch (error) {
                    const reason = error.message.split("\n")[0].trim()
                    const message = `could not read ${pdf} as a PDF${
                        reason && reason !== "Error" ? ` (${reason})` : ""
                    }`
                    // In a batch one bad file is reported and skipped; alone, it is the answer.
                    if (!batch) {
                        await converter.close()
                        fail(message)
                    }
                    console.error(`pdf_to_json: ${message}`)
                    failed.push(pdf)
                    continue
                }
                const result = options.text
                    ? pages.map((page, index) => ({ page: index + 1, text: pageText(page) }))
                    : pages
                const json = JSON.stringify(result, null, options.compact ? 0 : 2)

                const toStdout = !batch && !options.output && !options.outDir
                if (toStdout) {
                    console.log(json)
                    continue
                }
                const name = pdf.split(/[\\/]/).pop().replace(/\.pdf$/i, "") + ".json"
                const target = options.output ??
                    (options.outDir
                        ? `${options.outDir}/${name}`
                        : pdf.replace(/[^\\/]*$/, "") + name)
                if (options.outDir) {
                    await Deno.mkdir(options.outDir, { recursive: true })
                }
                await Deno.writeTextFile(target, json + "\n")
                console.error(`${pdf} -> ${target}`)
            }
        } finally {
            await converter.close()
        }
        if (failed.length > 0) {
            console.error(`pdf_to_json: ${failed.length} of ${pdfs.length} PDF(s) failed`)
        }
        // The browser behind the converter can keep the process alive after close (see tests/).
        Deno.exit(failed.length > 0 ? 1 : 0)
    })
    .parse(Deno.args)
