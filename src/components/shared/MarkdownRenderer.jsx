import React from 'react'

const MarkdownRenderer = ({ content }) => {
  if (!content) return null

  const parseInline = (text) => {
    // Bold
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>
      }
      // Code inline
      if (part.includes('`')) {
        const codeParts = part.split(/(`[^`]+`)/g)
        return codeParts.map((cp, i) => {
          if (cp.startsWith('`') && cp.endsWith('`')) {
            return <code key={`${index}-${i}`} className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-400 text-sm font-mono">{cp.slice(1, -1)}</code>
          }
          return cp
        })
      }
      return part
    })
  }

  const lines = content.split('\n')
  let inCodeBlock = false
  let codeContent = []
  let codeLanguage = ''

  const elements = []

  lines.forEach((line, i) => {
    // Code block handling
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={i} className="my-4 p-4 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            <code className="text-sm font-mono text-slate-300">{codeContent.join('\n')}</code>
          </pre>
        )
        codeContent = []
        inCodeBlock = false
      } else {
        codeLanguage = line.slice(3)
        inCodeBlock = true
      }
      return
    }

    if (inCodeBlock) {
      codeContent.push(line)
      return
    }

    // Headers
    if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={i} className="text-base font-bold text-slate-200 mt-6 mb-2">
          {parseInline(line.replace('#### ', ''))}
        </h4>
      )
      return
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-lg font-bold text-slate-100 mt-6 mb-3">
          {parseInline(line.replace('### ', ''))}
        </h3>
      )
      return
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-white mt-8 mb-4 pb-2 border-b border-slate-800">
          {parseInline(line.replace('## ', ''))}
        </h2>
      )
      return
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-2xl font-bold text-white mt-8 mb-4">
          {parseInline(line.replace('# ', ''))}
        </h1>
      )
      return
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="my-4 pl-4 border-l-4 border-cyan-500/50 text-slate-400 italic">
          {parseInline(line.replace('> ', ''))}
        </blockquote>
      )
      return
    }

    // Table detection
    if (line.startsWith('|') && line.endsWith('|')) {
      // Check if next line is separator
      const nextLine = lines[i + 1]
      const isHeader = nextLine && nextLine.includes('---')
      
      if (isHeader || line.includes('---')) {
        // Skip separator lines
        if (line.includes('---')) return
        
        const cells = line.split('|').filter(c => c.trim())
        elements.push(
          <tr key={i} className="border-b border-slate-800">
            {cells.map((cell, ci) => (
              <td key={ci} className="px-4 py-2 text-sm">
                {parseInline(cell.trim())}
              </td>
            ))}
          </tr>
        )
        return
      }
    }

    // List items
    if (line.trim().match(/^[\*\-]\s/)) {
      elements.push(
        <li key={i} className="flex items-start gap-2 ml-4 mb-1.5">
          <span className="text-cyan-500 mt-1.5">•</span>
          <span>{parseInline(line.replace(/^[\*\-]\s/, ''))}</span>
        </li>
      )
      return
    }

    // Numbered list
    if (line.trim().match(/^\d+\.\s/)) {
      const num = line.match(/^(\d+)\./)[1]
      elements.push(
        <li key={i} className="flex items-start gap-2 ml-4 mb-1.5">
          <span className="text-cyan-500 font-mono text-sm">{num}.</span>
          <span>{parseInline(line.replace(/^\d+\.\s/, ''))}</span>
        </li>
      )
      return
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-3" />)
      return
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="mb-3 text-slate-300 leading-relaxed">
        {parseInline(line)}
      </p>
    )
  })

  // Wrap tables
  const wrappedElements = []
  let tableRows = []
  
  elements.forEach((el, i) => {
    if (el?.type === 'tr') {
      tableRows.push(el)
    } else {
      if (tableRows.length > 0) {
        wrappedElements.push(
          <div key={`table-${i}`} className="my-4 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-800 rounded-lg">
              <tbody>{tableRows}</tbody>
            </table>
          </div>
        )
        tableRows = []
      }
      wrappedElements.push(el)
    }
  })

  // Handle remaining table rows
  if (tableRows.length > 0) {
    wrappedElements.push(
      <div key="table-final" className="my-4 overflow-x-auto">
        <table className="w-full border-collapse border border-slate-800 rounded-lg">
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    )
  }

  return <div className="text-slate-300">{wrappedElements}</div>
}

export default MarkdownRenderer
