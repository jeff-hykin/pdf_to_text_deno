#!/usr/bin/env -S deno run --allow-all
import { Command } from "jsr:@cliffy/command@1.0.0-rc.7"
import { PdfToTextConverter } from "./main.js"

function fail(message) {
    console.error(`pdf_to_json: ${message}`)
    Deno.exit(1)
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
            "with several, each is written next to its PDF as <name>.json (or into --out-dir).",
    )
    .arguments("<pdfs...:file>")
    .option("-o, --output <path:file>", "Write the JSON here instead of stdout (one PDF only)")
    .option("-d, --out-dir <dir:file>", "Write each <name>.json into this folder")
    .option("-t, --text", "Plain text per page ([{ page, text }]) instead of PDF.js text items")
    .option("-c, --compact", "No indentation")
    .action(async (options, ...pdfs) => {
        if (options.output && pdfs.length > 1) {
            fail("--output takes one PDF; use --out-dir for several")
        }
        for (const pdf of pdfs) {
            const info = await Deno.stat(pdf).catch(() => null)
            if (!info?.isFile) {
                fail(`no such file: ${pdf}`)
            }
        }
        const converter = new PdfToTextConverter({ shouldWarn: false })
        try {
            for (const pdf of pdfs) {
                const pages = await converter.convert(await Deno.readFile(pdf)).catch(
                    async (error) => {
                        await converter.close()
                        const reason = error.message.split("\n")[0].trim()
                        fail(
                            `could not read ${pdf} as a PDF${
                                reason && reason !== "Error" ? ` (${reason})` : ""
                            }`,
                        )
                    },
                )
                const result = options.text
                    ? pages.map((page, index) => ({ page: index + 1, text: pageText(page) }))
                    : pages
                const json = JSON.stringify(result, null, options.compact ? 0 : 2)

                const toStdout = pdfs.length === 1 && !options.output && !options.outDir
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
        // The browser behind the converter can keep the process alive after close (see tests/).
        Deno.exit(0)
    })
    .parse(Deno.args)
