## What is this?

This is a deno module that uses [astral](https://github.com/astral-sh/astral) and FireFox's [PDF.js](https://github.com/mozilla/pdf.js) to extract text from a PDF.

## How do I use this?

### From the command line

Install it as a `pdf_to_json` command (needs [Deno](https://deno.com)):

```sh
deno install -g -A -f -n pdf_to_json https://raw.githubusercontent.com/jeff-hykin/pdf_to_text_deno/0.1.2.0/cli.js
```

Or run it without installing: `deno run -A https://raw.githubusercontent.com/jeff-hykin/pdf_to_text_deno/0.1.2.0/cli.js statement.pdf`

```sh
pdf_to_json statement.pdf                      # JSON to stdout
pdf_to_json statement.pdf -o statement.json    # JSON to a file
pdf_to_json --text statement.pdf               # [{ "page": 1, "text": "..." }, ...]
pdf_to_json *.pdf                              # writes a.json next to a.pdf, b.json next to b.pdf, ...
pdf_to_json -d out/ *.pdf                      # ...or all of them into out/
pdf_to_json statements/                        # a .json next to every PDF in the folder (subfolders too)
```

In a batch (several PDFs, or a folder), a file that isn't a readable PDF is reported and skipped, and the command exits 1 at the end.

| Option | Meaning |
|---|---|
| `-o, --output <path>` | Write the JSON here instead of stdout (one PDF only) |
| `-d, --out-dir <dir>` | Write each `<name>.json` into this folder |
| `-t, --text` | Plain text per page (`[{ page, text }]`, a line break wherever PDF.js ends a line) instead of the raw PDF.js text items |
| `-c, --compact` | No indentation |

Without `--text`, the output is the raw PDF.js text content shown below: one entry per page.

### From code

```js
import { pdfToText, PdfToTextConverter } from "https://esm.sh/gh/jeff-hykin/pdf_to_text_deno@0.1.2.0/main.js"
 
// if doing multiple conversions, use this:
const converter = new PdfToTextConverter()
const result = await converter.convert(pdfData)
await converter.close() // clean up resouces

// if doing a one-off convert use this:
const textObjects = await pdfToText(pdfData)
textObjects == [
  {
    items: [
      {
        str: "Weather data is not",
        dir: "ltr",
        width: 47.423211000000016,
        height: 5.115,
        transform: [ 5.115, 0, 0, 5.115, 63.311, 769.2305 ],
        fontName: "g_d0_f1",
        hasEOL: false
      },
      {
        str: "",
        dir: "ltr",
        width: 0,
        height: 0,
        transform: [ 5.115, 0, 0, 5.115, 63.311, 763.0305 ],
        fontName: "g_d0_f1",
        hasEOL: true
      },
      {
        str: "available right now.",
        dir: "ltr",
        width: 46.56747150000002,
        height: 5.115,
        transform: [ 5.115, 0, 0, 5.115, 63.311, 763.0305 ],
        fontName: "g_d0_f1",
        hasEOL: false
      }
    ],
    styles: {
      g_d0_f1: {
        fontFamily: "sans-serif",
        ascent: 0.966796875,
        descent: -0.2109375,
        vertical: false
      }
    },
    lang: null
  }
]
```