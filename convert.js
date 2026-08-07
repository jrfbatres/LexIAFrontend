const fs = require('fs');

const htmlContent = fs.readFileSync('custom_lexia.html', 'utf8');

// Extract the body content
let bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) {
  console.log("No body found");
  process.exit(1);
}
let body = bodyMatch[1];

// Remove comments
body = body.replace(/<!--[\s\S]*?-->/g, '');

// Convert class to className
body = body.replace(/\bclass="/g, 'className="');

// Fix inline styles
body = body.replace(/style="([^"]*)"/g, (match, styleString) => {
  const styles = styleString.split(';').filter(s => s.trim());
  const styleObj = {};
  styles.forEach(s => {
    let [key, value] = s.split(':');
    if (key && value) {
      key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styleObj[key] = value.trim().replace(/'/g, '"');
    }
  });
  return `style={${JSON.stringify(styleObj)}}`;
});

// Self-close void tags (img, input, br, hr)
body = body.replace(/<(img|input|br|hr)([^>]*?)(?!\/)> /g, '<$1$2 /> ');
body = body.replace(/<(img|input|br|hr)([^>]*?)(?!\/)>/g, '<$1$2 />');

// Extract custom CSS from <style> tags
let styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/i);
let customCss = styleMatch ? styleMatch[1] : '';

const componentCode = `
'use client';
import React from 'react';

export default function LexiaAssistant() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: \`
        /* Custom styles */
        ${customCss}
      \`}} />
      <div className="dark h-screen w-screen overflow-hidden flex flex-col font-body-ui-md bg-background text-on-surface">
        ${body}
      </div>
    </>
  );
}
`;

fs.writeFileSync('src/app/page.js', componentCode);
console.log("Created src/app/page.js");
