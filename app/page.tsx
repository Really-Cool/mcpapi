import { Search, Github, Database, FileText, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#e5e5e5]">
      {/* Header */}
      <header className="border-b border-[#292524] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold mr-8">
            <span>MC</span>
            <span className="text-[#ea580c]">Papi</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* <Link href="#" className="text-[#9ca3af] hover:text-[#e5e5e5]">
            <Github className="h-5 w-5" />
          </Link> */}
          <Link href="https://xiaohui.cool/" className="text-[#9ca3af] hover:text-[#e5e5e5]">
            <span>文档</span>
          </Link>
          {/* <Link href="#" className="bg-[#ea580c] text-white px-3 py-1.5 rounded text-sm">
            + Add Server
          </Link> */}
          {/* <Link href="#" className="text-[#e5e5e5] hover:text-white">
            Login
          </Link> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-12 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <p className="text-[#9ca3af] mb-6">
            让您的 Agent 通过 
            <Link href="https://modelcontextprotocol.io/introduction" className="text-[#ea580c] hover:underline">
              Model Context Protocol
            </Link>  servers 无所不能
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="随便问问,看您还需要什么MCP"
              className="w-full bg-[#292524] border border-[#444444] rounded px-4 py-2 text-[#e5e5e5] focus:outline-none focus:ring-1 focus:ring-[#ea580c]"
            />
            <button className="absolute right-1 top-1 bg-[#ea580c] p-1.5 rounded">
              <Search className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Featured Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Featured</h2>
              <span className="text-xs bg-[#292524] px-1.5 py-0.5 rounded text-[#9ca3af]">5</span>
            </div>
            <div className="flex items-center gap-2">
              {/* <Link href="#" className="text-sm text-[#9ca3af] hover:text-[#e5e5e5]">
                View all
              </Link> */}
              <div className="flex gap-1">
                {/* <button className="p-1 rounded bg-[#292524] text-[#9ca3af]">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="p-1 rounded bg-[#292524] text-[#9ca3af]">
                  <ChevronRight className="h-4 w-4" />
                </button> */}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Sequential Thinking */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#ea580c]" />
                  <span className="font-medium">Sequential Thinking</span>
                </div>
                <span className="text-xs text-[#9ca3af]">↓🔥</span>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <Link href="https://github.com/smithery-ai/reference-servers/tree/main/src/sequentialthinking" className="text-[#f97316] hover:underline">
                  @mcthinking/sequential-thinking
                </Link>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                这个MCP 服务器可以帮助 Agent 通过结构化思考过程来有效地解决问题，就像资深项目经理一样。
              </p>
            </div>

            {/* Github */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-[#ea580c]" />
                  <span className="font-medium">Github</span>
                </div>
                <span className="text-xs text-[#9ca3af]">↓ 16.7k</span>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@mcthinking/github</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Access the GitHub API, enabling file operations, repository management, search functionality, and more.
              </p>
            </div>

            {/* Brave Search */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-[#ea580c]" />
                  <span className="font-medium">Brave Search</span>
                </div>
                <span className="text-xs text-[#9ca3af]">↓ 7.62k</span>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@brave/brave-search</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">Integrate web and local search capabilities.</p>
            </div>

            {/* Magic MCP */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">✨</span>
                  <span className="font-medium">Magic MCP</span>
                </div>
                <span className="text-xs text-[#9ca3af]">↓ 5.26k</span>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@magic/developer-mcp</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">v0 for MCP. Frontend feels like Magic.</p>
            </div>

            {/* Fetch */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-[#ea580c]" />
                  <span className="font-medium">Fetch</span>
                </div>
                <span className="text-xs text-[#9ca3af]">↓ 2.2k</span>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@mcfetch/fetch</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">A simple tool that performs a fetch request through.</p>
            </div>
          </div>
        </section>

        {/* Web Development Tools Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Web Development Tools</h2>
              <span className="text-xs bg-[#292524] px-1.5 py-0.5 rounded text-[#9ca3af]">174</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="#" className="text-sm text-[#9ca3af] hover:text-[#e5e5e5]">
                View all
              </Link>
              <div className="flex gap-1">
                <button className="p-1 rounded bg-[#292524] text-[#9ca3af]">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="p-1 rounded bg-[#292524] text-[#9ca3af]">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* OSP Marketing Tools */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">📊</span>
                  <span className="font-medium">OSP Marketing Tools</span>
                </div>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>osp-marketing-tools</span>
              </div>
              <p className="text-sm text-[#9ca3af]">Tools for technical content creation and product positioning.</p>
            </div>

            {/* Integration App Server */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">🔄</span>
                  <span className="font-medium">Integration App Server</span>
                </div>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@integration-app/mcp-server</span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Exposes tools powered by Integration App, tools: Gmail, Calendar and 20 more.
              </p>
            </div>

            {/* VeryaX MCP */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">⚡</span>
                  <span className="font-medium">VeryaX MCP</span>
                </div>
                <span className="text-xs text-[#9ca3af]">↓ 751</span>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@VeryaX/verya-mcp</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Gives MCP tool to connect all your favorite tools: Gmail, Calendar and 20 more.
              </p>
            </div>

            {/* Notion API */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">📝</span>
                  <span className="font-medium">Notion API</span>
                </div>
                <span className="text-xs text-[#9ca3af]">↓ 392</span>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>notion-api-mcp</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Integrate and manage Notion databases and tasks using Notion's API.
              </p>
            </div>

            {/* Web Research Server */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-[#ea580c]" />
                  <span className="font-medium">Web Research Server</span>
                </div>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@mchumming/web-research</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Integrate real-time web research capabilities into your workflow. Conduct thorough research with tools
                for searching, content extraction.
              </p>
            </div>
          </div>
        </section>

        {/* Google Workspace Integration Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Google Workspace Integration</h2>
              <span className="text-xs bg-[#292524] px-1.5 py-0.5 rounded text-[#9ca3af]">48</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="#" className="text-sm text-[#9ca3af] hover:text-[#e5e5e5]">
                View all
              </Link>
              <div className="flex gap-1">
                <button className="p-1 rounded bg-[#292524] text-[#9ca3af]">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="p-1 rounded bg-[#292524] text-[#9ca3af]">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Google Workspace Integration */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-[#ea580c]" />
                  <span className="font-medium">Google Workspace Integra</span>
                </div>
                <span className="text-xs text-[#9ca3af]">↓ 101</span>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>mcp-gsuit</span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Interact with Gmail and Google Calendar, manage Google accounts, search and compose emails, and manage
                calendar events.
              </p>
            </div>

            {/* G Suite Integration */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">📧</span>
                  <span className="font-medium">G Suite Integration</span>
                </div>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@mchumming/gsuite-tools</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">Interact with Google products like Gmail and Calendar.</p>
            </div>

            {/* Google Calendar */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">📅</span>
                  <span className="font-medium">Google Calendar</span>
                </div>
                <span className="text-xs text-[#9ca3af]">↓ 32</span>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>google-calendar-mcp</span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Integration with Google Calendar to manage events through a standardized interface.
              </p>
            </div>

            {/* G Suite Integration */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">📧</span>
                  <span className="font-medium">G Suite Integration</span>
                </div>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@mchumming/gsuite-tools</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">Interact with Google products like Gmail and Calendar.</p>
            </div>

            {/* Google Workspace MCP Server */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">🔄</span>
                  <span className="font-medium">Google Workspace MCP Server</span>
                </div>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>google-workspace-server</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">Interact with Gmail and Calendar APIs via MC interface.</p>
            </div>
          </div>
        </section>

        {/* Protocol Integration Solutions Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Protocol Integration Solutions</h2>
              <span className="text-xs bg-[#292524] px-1.5 py-0.5 rounded text-[#9ca3af]">119</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="#" className="text-sm text-[#9ca3af] hover:text-[#e5e5e5]">
                View all
              </Link>
              <div className="flex gap-1">
                <button className="p-1 rounded bg-[#292524] text-[#9ca3af]">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="p-1 rounded bg-[#292524] text-[#9ca3af]">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Model Context Protocol Server */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">🔄</span>
                  <span className="font-medium">Model Context Protocol Serv</span>
                </div>
                <span className="text-xs text-[#9ca3af]">↓ 1</span>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@mchumming/servers</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Showcase versatile implementations of the Model Context Protocol for secure LLM access and interaction.
              </p>
            </div>

            {/* MCP Server Starter */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">📦</span>
                  <span className="font-medium">MCP Server Starter</span>
                </div>
                <span className="text-xs text-[#9ca3af]">↓ 19</span>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@mchumming/server-starter</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Build a robust server to enable AI agents to interact with various tools.
              </p>
            </div>

            {/* Database Explorer */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-[#ea580c]" />
                  <span className="font-medium">Database Explorer</span>
                </div>
                <span className="text-xs text-[#9ca3af]">↓ 17</span>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@mchumming/db-tool</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Connect to and manage various databases efficiently. Execute queries, list tables, and manage your data.
              </p>
            </div>

            {/* Second Opinion */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">🧠</span>
                  <span className="font-medium">Second Opinion</span>
                </div>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@second/second-opinion-mcp-server</span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Provides AI-powered assistance for coding problems using insights from multiple sources.
              </p>
            </div>

            {/* Claude Code MCP Server */}
            <div className="bg-[#292524] rounded-md p-4 border border-[#444444]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 text-[#ea580c] flex items-center justify-center">🤖</span>
                  <span className="font-medium">Claude Code MCP Server</span>
                </div>
              </div>
              <div className="text-xs text-[#9ca3af] mb-2">
                <span>@mchumming/claude-code-mcp</span>
                <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#22c55e]"></span>
              </div>
              <p className="text-sm text-[#9ca3af]">
                Leverage powerful software engineering capabilities through a standardized interface. Enhance your
                coding workflow with Claude.
              </p>
            </div>
          </div>
        </section>

        {/* Additional sections would follow the same pattern */}
        {/* For brevity, I'm showing just a few sections */}
      </main>
    </div>
  )
}

