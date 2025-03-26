#!/usr/bin/env sh
echo --% >/dev/null;: ' | out-null
<#'

#
# for not-Windows operating systems
#
deno run -A --no-config 'https://deno.land/x/binaryify@2.5.5.0/binaryify.js' -- ./main/pdf.worker.mjs
deno run -A --no-config 'https://raw.githubusercontent.com/jeff-hykin/deno_bundle/dfb2b5620aa04f593aad32cc38fb5c15cb299596/main.js' ./main/client_main.js > ./main/client_main.bundle.js
deno run -A https://esm.sh/gh/jeff-hykin/html-bundle@0.0.3.0/main/html-bundle.js ./main/index.html
deno run -A --no-config 'https://deno.land/x/binaryify@2.5.5.0/binaryify.js' --text -- ./main/index.bundled.html

exit #>

#
# for windows (powershell)
#
deno run -A --no-config 'https://deno.land/x/binaryify@2.5.5.0/binaryify.js' -- ./main/pdf.worker.mjs
deno run -A --no-config 'https://raw.githubusercontent.com/jeff-hykin/deno_bundle/dfb2b5620aa04f593aad32cc38fb5c15cb299596/main.js' ./main/client_main.js > ./main/client_main.bundle.js
deno run -A https://esm.sh/gh/jeff-hykin/html-bundle@0.0.3.0/main/html-bundle.js ./main/index.html
deno run -A --no-config 'https://deno.land/x/binaryify@2.5.5.0/binaryify.js' --text -- ./main/index.bundled.html