import hljs from 'highlight.js';
import jsonHighlighter from 'highlight.js/lib/languages/json';
import xmlHighlighter from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('json', jsonHighlighter);
hljs.registerLanguage('html', xmlHighlighter);

export async function html(value: string): Promise<string> {
  // Simple HTML formatting without prettier
  const formatHtml = (html: string): string => {
    let formatted = html;
    let indent = 0;
    const tab = '  ';
    
    formatted = formatted.replace(/>\s*</g, '><');
    formatted = formatted.replace(/></g, '>\n<');
    
    const lines = formatted.split('\n');
    const result: string[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length === 0) return;
      
      if (trimmed.match(/^<\/\w/)) {
        indent = Math.max(0, indent - 1);
      }
      
      result.push(tab.repeat(indent) + trimmed);
      
      if (trimmed.match(/^<\w[^>]*[^\/]>$/)) {
        indent++;
      }
    });
    
    return result.join('\n');
  };
  
  const prettyValue = formatHtml(value);
  return hljs.highlight(prettyValue, { language: 'html' }).value;
}

export async function json(value: string): Promise<string> {
  // Simple JSON formatting without prettier
  const formatJson = (jsonString: string): string => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      return jsonString; // Return original if parsing fails
    }
  };
  
  const prettyValue = formatJson(value);
  return hljs.highlight(prettyValue, { language: 'json' }).value;
}
