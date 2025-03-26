## What is this?

This is a deno module that uses [astral](https://github.com/astral-sh/astral) and FireFox's [PDF.js](https://github.com/mozilla/pdf.js) to extract text from a PDF.

## How do I use this?

```js
import { pdfToText, PdfToTextConverter } from "https://esm.sh/gh/jeff-hykin/pdf_to_text_deno@0.1.0.0/main.js"
 
// if doing multiple conversions, use this:
const converter = new PdfToTextConverter()
const result = await converter.convert(pdfData, {tryCap})
await pdfToText.close() // clean up resouces

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