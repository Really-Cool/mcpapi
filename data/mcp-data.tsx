import { MCPSection } from "@/types/mcp";
import { Search, Github, Database, FileText, ArrowRight } from "lucide-react";

export const mcpSections: MCPSection[] = [
  {
    id: "featured",
    title: "大家在用",
    count: 5,
    items: [
      {
        id: "sequential-thinking",
        title: "Sequential Thinking",
        packageName: "@mcthinking/sequential-thinking",
        description: "这个MCP服务器可以帮助Agent通过结构化思考过程来有效地解决问题，就像资深项目经理一样。",
        icon: <FileText className="h-5 w-5" />,
        downloads: "🔥",
        isActive: true,
        githubLink: "https://github.com/smithery-ai/reference-servers/tree/main/src/sequentialthinking"
      },
      {
        id: "github",
        title: "Github",
        packageName: "@mcthinking/github",
        description: "访问GitHub API，实现文件操作、仓库管理、搜索功能等多种功能。",
        icon: <Github className="h-5 w-5" />,
        downloads: "16.7k",
        isActive: true,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      },
      {
        id: "brave-search",
        title: "Brave Search",
        packageName: "@brave/brave-search",
        description: "集成网络和本地搜索功能，提供强大的信息检索能力。",
        icon: <Search className="h-5 w-5" />,
        downloads: "7.62k",
        isActive: true,
        githubLink: "https://github.com/Henry-Jessie/brave-search-server"
      },
      {
        id: "magic-mcp",
        title: "Magic MCP",
        packageName: "@magic/developer-mcp",
        description: "MCP的v0版本，前端体验如魔法般流畅，提供直观的用户界面。",
        icon: <span className="h-5 w-5 flex items-center justify-center">✨</span>,
        downloads: "5.26k",
        isActive: true,
        githubLink: "https://github.com/21st-dev/magic-mcp"
      },
      {
        id: "fetch",
        title: "Fetch",
        packageName: "@mcfetch/fetch",
        description: "一个简单的工具，可以执行网络请求并获取内容，支持多种格式转换。",
        icon: <ArrowRight className="h-5 w-5" />,
        downloads: "2.2k",
        isActive: true,
        githubLink: "https://github.com/zcaceres/fetch-mcp"
      }
    ]
  },
  {
    id: "web-development",
    title: "网页开发",
    count: 174,
    items: [
      {
        id: "osp-marketing",
        title: "OSP Marketing Tools",
        packageName: "osp-marketing-tools",
        description: "用于技术内容创建和产品定位的工具，帮助开发者更好地展示项目。",
        icon: <span className="h-5 w-5 flex items-center justify-center">📊</span>,
        isActive: false,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      },
      {
        id: "integration-app",
        title: "Integration App Server",
        packageName: "@integration-app/mcp-server",
        description: "提供由Integration App支持的工具，包括Gmail、日历等20多种应用集成。",
        icon: <span className="h-5 w-5 flex items-center justify-center">🔄</span>,
        isActive: false,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      },
      {
        id: "veryax-mcp",
        title: "VeryaX MCP",
        packageName: "@VeryaX/verya-mcp",
        description: "提供MCP工具连接您所有喜爱的工具：Gmail、日历等20多种应用。",
        icon: <span className="h-5 w-5 flex items-center justify-center">⚡</span>,
        downloads: "751",
        isActive: true,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      },
      {
        id: "notion-api",
        title: "Notion API",
        packageName: "notion-api-mcp",
        description: "集成和管理Notion数据库和任务，使用Notion的API实现无缝协作。",
        icon: <span className="h-5 w-5 flex items-center justify-center">📝</span>,
        downloads: "392",
        isActive: true,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      },
      {
        id: "web-research",
        title: "Web Research Server",
        packageName: "@mchumming/web-research",
        description: "将实时网络研究功能集成到您的工作流程中，使用搜索和内容提取工具进行彻底研究。",
        icon: <ArrowRight className="h-5 w-5" />,
        isActive: true,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      }
    ]
  },
  {
    id: "google-workspace",
    title: "Google 生态",
    count: 48,
    items: [
      {
        id: "google-workspace-integration",
        title: "Google Workspace Integra",
        packageName: "mcp-gsuit",
        description: "与Gmail和Google日历交互，管理Google账户，搜索和撰写电子邮件，以及管理日历事件。",
        icon: <Github className="h-5 w-5" />,
        downloads: "101",
        isActive: false,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      },
      {
        id: "gsuite-integration",
        title: "G Suite Integration",
        packageName: "@mchumming/gsuite-tools",
        description: "与Google产品如Gmail和日历交互，提供无缝的工作流程集成。",
        icon: <span className="h-5 w-5 flex items-center justify-center">📧</span>,
        isActive: true,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      },
      {
        id: "google-calendar",
        title: "Google Calendar",
        packageName: "google-calendar-mcp",
        description: "通过标准化接口与Google日历集成，管理事件和日程安排。",
        icon: <span className="h-5 w-5 flex items-center justify-center">📅</span>,
        downloads: "32",
        isActive: false,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      },
      {
        id: "gsuite-tools",
        title: "G Suite Integration",
        packageName: "@mchumming/gsuite-tools",
        description: "与Google产品如Gmail和日历交互，提供全面的工作协作功能。",
        icon: <span className="h-5 w-5 flex items-center justify-center">📧</span>,
        isActive: true,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      },
      {
        id: "google-workspace-server",
        title: "Google Workspace MCP Server",
        packageName: "google-workspace-server",
        description: "通过MC接口与Gmail和日历API交互，实现高效的工作流程自动化。",
        icon: <span className="h-5 w-5 flex items-center justify-center">🔄</span>,
        isActive: true,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      }
    ]
  },
  {
    id: "protocol-integration",
    title: "专注于连接",
    count: 119,
    items: [
      {
        id: "model-context-protocol",
        title: "Model Context Protocol Serv",
        packageName: "@mchumming/servers",
        description: "展示Model Context Protocol的多功能实现，用于安全的LLM访问和交互。",
        icon: <span className="h-5 w-5 flex items-center justify-center">🔄</span>,
        downloads: "1",
        isActive: true,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      },
      {
        id: "mcp-server-starter",
        title: "MCP Server Starter",
        packageName: "@mchumming/server-starter",
        description: "构建强大的服务器，使AI代理能够与各种工具交互，快速启动您的MCP项目。",
        icon: <span className="h-5 w-5 flex items-center justify-center">📦</span>,
        downloads: "19",
        isActive: true,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      },
      {
        id: "database-explorer",
        title: "Database Explorer",
        packageName: "@mchumming/db-tool",
        description: "高效连接和管理各种数据库，执行查询，列出表格，管理您的数据。",
        icon: <Database className="h-5 w-5" />,
        downloads: "17",
        isActive: true,
        githubLink: "https://github.com/hannesrudolph/sqlite-explorer-fastmcp-mcp-server"
      },
      {
        id: "second-opinion",
        title: "Second Opinion",
        packageName: "@second/second-opinion-mcp-server",
        description: "利用多个来源的见解为编码问题提供AI驱动的帮助，获取专业建议。",
        icon: <span className="h-5 w-5 flex items-center justify-center">🧠</span>,
        isActive: false,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      },
      {
        id: "claude-code-mcp",
        title: "Claude Code MCP Server",
        packageName: "@mchumming/claude-code-mcp",
        description: "通过标准化接口利用强大的软件工程能力，使用Claude增强您的编码工作流程。",
        icon: <span className="h-5 w-5 flex items-center justify-center">🤖</span>,
        isActive: true,
        githubLink: "https://github.com/modelcontextprotocol/servers"
      }
    ]
  }
];
