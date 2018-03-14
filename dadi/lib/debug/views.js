/**
 * @module: Error HTML output
 */

module.exports.error = function (error) {
  return `<!DOCTYPE html><html lang="en"><head> <meta charset="utf-8"> <title>${
    error.statusCode
  } Error</title> <style type="text/css"> *{padding: 0; margin: 0;}html{height: 100%;}body{background: #f4f4f4; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; text-align: center; font-size: 17px; line-height: 23px; min-height: 100%; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-align-items: center; -ms-flex-align: center; align-items: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center}main{width: 100%; max-width: 500px; padding: 20px; margin: auto; text-align: left}div, .message{font-family: "Lucida Sans Typewriter", "Lucida Console", monaco, "Bitstream Vera Sans Mono", monospace}div{background: #e0e0e0; display: none; font-size: 14px; margin: 1.2em 0; overflow: hidden; border-radius: 3px; line-height: normal}#toggle:checked + div{display: block}pre{padding: 15px; overflow: scroll; -webkit-overflow-scroll: touch}h1{font-size: 24px; margin: 1em 0 0.6em}h2{background: #000; color: #fff; padding: 15px; font-size: 15px}p{margin: 0 0 1.2em 0}.message{color: #999; margin-top: 1.2em; font-size: 14px}.message span{color: #555}.message a{color: inherit}label{cursor: pointer; border-radius: 4px; background: #295def; color: #fff; padding: 4px 7px; user-select: none}</style></head><body> <main> <svg width="90" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96.2 83.9"> <style>.st0{fill: #f79800}</style> <path class="st0" d="M94.2 83.9H2c-.7 0-1.4-.4-1.7-1-.4-.6-.4-1.4 0-2L46.4 1c.4-.6 1-1 1.7-1s1.4.4 1.7 1l46.1 79.9c.4.6.4 1.4 0 2-.3.6-1 1-1.7 1zm-88.7-4h85.3L48.1 6 5.5 79.9z"/> <path class="st0" d="M48.1 59c-1.1 0-2-.9-2-2V30.8c0-1.1.9-2 2-2s2 .9 2 2V57c0 1.1-.9 2-2 2zM48.1 70.4c-1.1 0-2-.9-2-2v-2.8c0-1.1.9-2 2-2s2 .9 2 2v2.8c0 1.1-.9 2-2 2z"/> </svg> <h1>${
    error.headline
  }</h1> <p>${
    error.human
  }</p><label for="toggle">Show me the technical details</label> <input type="checkbox" name="toggle" id="toggle"/> <div> <h2>${
    error.developer
  }</h2> <pre>${
    error.stack
  }</pre> </div><p class="message"><a target="_blank" href="https://httpstatuses.com/${
    error.statusCode
  }">${error.statusCode}</a> ${error.error}<br>${
    error.server
  }</p></main></body></html>`
}
