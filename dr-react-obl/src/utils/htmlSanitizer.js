function sanitizeHTML(html) {
    const allowedTags = [
        'p', 'a', 'abbr', 'acronym', 'address', 'area', 'b', 'bdi', 'bdo', 'big', 'blockquote', 'br', 'button',
        'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'figcaption', 'figure',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'ins', 'kbd', 'li', 'mark', 'ol', 'p', 'pre', 'q', 's',
        'samp', 'small', 'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'u', 'ul',
    ];      
    const sanitizedHTML = html.replace(/<[^>]*>/g, (match) => {
        const tagName = match.split(/[<>\\s]+/)[1];
    
        if (allowedTags.includes(tagName)) {
            return match.replace(/ [a-zA-Z-]+=["'][^"']*["']/g, '');
        }
        return '';
    });
    // console.log(sanitizedHTML)
    return sanitizedHTML;
}
export default sanitizeHTML;
  