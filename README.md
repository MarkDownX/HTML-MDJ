# HTML-MDJ
Converts HTML to the .MDJ format MDX uses.

## Web Setup

Include `index.js` and `htmlparser2.js`

## Server Setup

We plan to publish this to NPM soon...

## Convert HTML to MDJ

Use the `html2mdj()` method. This takes one argument, the HTML as a string and returns an array, which you can use `JSON.stringify` to convert to JSON. The array contains one item for each line of HTML then each item has a content array which contains the content of that line. A few tips to make sure your HTML is valid:

- Don't have any text nodes that don't have a parent element - we plan to add a fix for this
- Don't put your tags in the wrong order
