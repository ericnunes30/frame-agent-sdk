import { MCPBase } from '../../src/mcp'

async function main() {
  const context7 = new MCPBase({ id: 'context7', transport: 'stdio', command: 'node', args: ['path/to/context7-server.js'], namespace: 'context7' })
  const browser = new MCPBase({ id: 'browser', transport: 'stdio', command: 'node', args: ['path/to/browser-server.js'], namespace: 'puppeteer' })
  console.log('init')
  try {
    await context7.connect()
    await browser.connect()
  } catch (e) {
    console.error('connect_error', e instanceof Error ? e.message : String(e))
    return
  }
  const ctxTools = await context7.createTools({ include: ['resolve-library-id', 'get-library-docs'] })
  const brTools = await browser.createTools({ include: ['navigate', 'screenshot', 'click', 'select', 'fill', 'hover'] })
  const ctxSchemas = context7.toToolSchemas(ctxTools)
  const brSchemas = browser.toToolSchemas(brTools)
  console.log('context7_tools', ctxTools.map(t => t.name))
  console.log('browser_tools', brTools.map(t => t.name))
  console.log('context7_schemas', JSON.stringify(ctxSchemas, null, 2))
  console.log('browser_schemas', JSON.stringify(brSchemas, null, 2))
}

main().catch(err => {
  console.error('fatal', err)
})
