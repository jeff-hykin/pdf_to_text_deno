import { pdfToText } from '../main.js' 
await pdfToText(Deno.readFileSync("../test_data/compass_neurons_small.pdf")).then(console.log)
// FIXME: I shouldn't need to do this. This might be a bug in either Deno.serve() (the abortController) or astral
Deno.exit(0)