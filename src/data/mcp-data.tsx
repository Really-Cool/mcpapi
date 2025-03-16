import { MCPSection } from "@/types/mcp";
import { Search, Github, Database, FileText, ArrowRight } from "lucide-react";

export const mcpSections: MCPSection[] = [
  {
    id: "featured",
    title: "大家在用",
    count: 4,
    items: [
      {
        id: "dr.smithery",
        title: "Dr.Smithery",
        packageName: "@insrisk/dr.smithery",
        description: "Dr.Smithery是一个元MCP服务器，可以作为第0个MCP推荐其他MCP以及自动安装、启动。",
        icon: <FileText className="h-5 w-5" />,
        iconName: "📄",
        downloads: "🔥",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      },
      {
        id: "mcpbridge",
        title: "MCPBridge",
        packageName: "@insrisk/mcpbridge",
        description: "MCPBridge 负责桥接HTTP接口、百灵Agent 到MCP服务器。",
        icon: <FileText className="h-5 w-5" />,
        iconName: "🐙",
        downloads: "16.7k",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      },
      {
        id: "brave-search",
        title: "赔付率异动分析",
        packageName: "@brave/brave-search",
        description: "赔付率异动分析，提供对保险赔付率指标风险深入、全面的分析和洞察。",
        icon: <Search className="h-5 w-5" />,
        iconName: "🔍",
        downloads: "7.62k",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      },
      {
        id: "magic-mcp",
        title: "端到端风控策略部署",
        packageName: "@magic/developer-mcp",
        description: "端到端风控策略部署，提供从策略的系分、Code实现、验证到部署、旁路的完整流程。",
        icon: <span className="h-5 w-5 flex items-center justify-center">✨</span>,
        iconName: "✨",
        downloads: "5.26k",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      }
    ]
  },
  {
    id: "web-development",
    title: "保险精算",
    count: 5,
    items: [
      {
        id: "osp-marketing",
        title: "定价方案流程管理",
        packageName: "@insrisk/osp-marketing",
        description: "定价方案流程管理，提供从需求分析、方案设计、审批到执行的完整流程。",
        icon: <span className="h-5 w-5 flex items-center justify-center">📊</span>,
        iconName: "📊",
        isActive: false,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      },
      {
        id: "integration-app",
        title: "责任保费计费",
        packageName: "@insrisk/integration-app",
        description: "提供保险产品责任保费计费工具，帮助您计算和管理保费。",
        icon: <span className="h-5 w-5 flex items-center justify-center">🔄</span>,
        iconName: "🔄",
        isActive: false,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      },
      {
        id: "veryax-mcp",
        title: "精算场景测试",
        packageName: "@insrisk/veryax-mcp",
        description: "提供精算场景测试工具，帮助您测试和优化保险精算模型。",
        icon: <span className="h-5 w-5 flex items-center justify-center">⚡</span>,
        iconName: "⚡",
        downloads: "751",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      },
      {
        id: "notion-api",
        title: "精算敏感性测试",
        packageName: "@insrisk/actuarial-mcp",
        description: "提供精算敏感性测试工具，帮助您测试和优化保险精算模型。",
        icon: <span className="h-5 w-5 flex items-center justify-center">📝</span>,
        iconName: "📝",
        downloads: "392",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      },
      {
        id: "web-research",
        title: "外部保险产品搜索",
        packageName: "@insurance/product-search",
        description: "提供保险产品搜索工具，帮助您快速找到您需要了解的其他公司保险产品。",
        icon: <ArrowRight className="h-5 w-5" />,
        iconName: "➡️",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      }
    ]
  },
  {
    id: "google-workspace",
    title: "保单与案件域",
    count: 3,
    items: [
      {
        id: "case-analysis",
        title: "理赔案件分析",
        packageName: "@insrisk/insrisk-case-analysis",
        description: "提供理赔案件分析工具，快速准备分析理赔案件的风险",
        icon: <ArrowRight className="h-5 w-5" />,
        iconName: "➡️",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      },
      {
        id: "insrisk-search",
        title: "保单搜索",
        packageName: "@insrisk/insrisk-policy-search",
        description: "提供保单搜索工具，帮助您快速找到您需要了解的保单。",
        icon: <ArrowRight className="h-5 w-5" />,
        iconName: "➡️",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      },
      {
        id: "insrisk-detail",
        title: "保单详情查询",
        packageName: "@insrisk/insrisk-policy-detail",
        description: "提供保单详情查询工具，帮助您快速找到您需要了解的保单详情。",
        icon: <ArrowRight className="h-5 w-5" />,
        iconName: "➡️",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      }
    ]
  },
  {
    id: "protocol-integration",
    title: "策略域",
    count: 2,
    items: [
      {
        id: "insrisk-policy",
        title: "风控策略查询",
        packageName: "@insrisk/insrisk-policy",
        description: "提供风控策略查询工具，帮助您快速找到您需要了解的风控策略。",
        icon: <ArrowRight className="h-5 w-5" />,
        iconName: "➡️",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      },
      {
        id: "strategy-deployment",
        title: "端到端策略部署",
        packageName: "@magic/developer-mcp",
        description: "端到端策略部署，提供从策略的系分、Code实现、验证到部署、旁路的完整流程。",
        icon: <span className="h-5 w-5 flex items-center justify-center">✨</span>,
        iconName: "✨",
        downloads: "5.26k",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      }
    ]
  },
  {
    id: "feature-domain",
    title: "特征域",
    count: 2,
    items: [
      {
        id: "insrisk-feature-generator",
        title: "风控特征生成",
        packageName: "@insrisk/insrisk-feature-generator",
        description: "提供风控特征生成工具，帮助您快速生成您需要的风控特征。",
        icon: <ArrowRight className="h-5 w-5" />,
        iconName: "➡️",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      },
      {
        id: "insrisk-feature-collector",
        title: "风控特征自助取数",
        packageName: "@insrisk/insrisk-feature-collector",
        description: "提供风控特征自助取数工具，帮助您快速找到您需要的风控特征。",
        icon: <ArrowRight className="h-5 w-5" />,
        iconName: "➡️",
        isActive: true,
        githubLink: "https://agent.alipay.com/agent/app/appManage?botId=106349&projectId=7538"
      }
    ]
  }
];
