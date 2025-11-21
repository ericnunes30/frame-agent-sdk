import { MCPBase } from '../../dist/src/mcp/index.js'

async function main() {
  const mcp = new MCPBase({ id: 'context7', transport: 'stdio', command: 'docker', args: ['run', '-i', '--rm', 'mcp-context7'], namespace: 'context7' })
  await mcp.connect()
  const tools = await mcp.createTools()
  console.log('tools', tools.map(t => t.name))
  const resolveTool = tools.find(t => t.name.endsWith('/resolve-library-id') || t.name.includes('resolve-library-id'))
  if (resolveTool) {
    const r = await (resolveTool as any).execute({ libraryName: 'next.js' })
    console.log('resolve_library_id', r)
  }
  const docsTool = tools.find(t => t.name.endsWith('/get-library-docs') || t.name.includes('get-library-docs'))
  if (docsTool) {
    const d = await (docsTool as any).execute({ context7CompatibleLibraryID: '/vercel/next.js', topic: 'routing', page: 1 })
    console.log('get_library_docs', d)
  }
}

main().catch(err => {
  console.error('error', err)
})
