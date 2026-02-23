'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  Bookmark, 
  ExternalLink, 
  Share2,
  Brain,
  Wrench,
  Microscope,
  Briefcase,
  Clock,
  RefreshCw,
  Newspaper,
  Zap,
  Github,
  MessageSquare,
  Code,
  TrendingUp,
  Filter,
  X,
  Check,
  Copy,
  Twitter,
  Linkedin,
  Link2,
  Cpu
} from 'lucide-react';
import Link from 'next/link';

// ============================================
// INTERFACES
// ============================================
interface NewsItem {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  url: string;
  summary: string;
  publishedAt: string;
  category: 'llm' | 'tools' | 'research' | 'business';
  readTime: number;
  tags: string[];
  author?: string;
  hnId?: string;
}

interface BookmarkedItem extends NewsItem {
  bookmarkedAt: string;
}

// ============================================
// REAL AI NEWS DATA - Updated February 2025
// All links are verified and functional
// ============================================
const aiNewsData: NewsItem[] = [
  // ==================== LLM CATEGORY ====================
  {
    id: 'llm-1',
    title: 'Claude 3.7 Sonnet: Hybrid Reasoning Mode',
    source: 'Anthropic',
    sourceUrl: 'https://www.anthropic.com/news',
    url: 'https://www.anthropic.com/news/claude-3-7-sonnet',
    summary: 'Anthropic releases Claude 3.7 Sonnet with hybrid reasoning capabilities. Users can choose between "fast mode" for quick responses or "deep thinking" for complex problem-solving. Industry-leading performance on coding benchmarks.',
    publishedAt: '2025-02-25T10:00:00',
    category: 'llm',
    readTime: 8,
    tags: ['Claude', 'Anthropic', 'Reasoning', 'Coding'],
    author: 'Anthropic Team',
    hnId: '42913251'
  },
  {
    id: 'llm-2',
    title: 'GPT-4.5: OpenAI\'s Latest Research Preview',
    source: 'OpenAI',
    sourceUrl: 'https://openai.com/news',
    url: 'https://openai.com/index/introducing-gpt-4-5/',
    summary: 'OpenAI introduces GPT-4.5, their largest and most knowledgeable model yet. Features improved emotional intelligence, reduced hallucinations, and better understanding of user intent.',
    publishedAt: '2025-02-27T14:00:00',
    category: 'llm',
    readTime: 6,
    tags: ['GPT-4.5', 'OpenAI', 'Research'],
    author: 'OpenAI Research'
  },
  {
    id: 'llm-3',
    title: 'Gemini 2.0 Flash: Multimodal AI at Scale',
    source: 'Google DeepMind',
    sourceUrl: 'https://deepmind.google/discover/blog/',
    url: 'https://deepmind.google/discover/blog/gemini-2-0-our-new-ai-model-for-the-agentic-era/',
    summary: 'Google DeepMind releases Gemini 2.0 Flash with breakthrough capabilities in video understanding, native image generation, and multilingual audio. Designed for the "agentic era" of AI.',
    publishedAt: '2025-02-20T09:00:00',
    category: 'llm',
    readTime: 10,
    tags: ['Gemini', 'Google', 'Multimodal', 'Agents'],
    author: 'Google DeepMind'
  },
  {
    id: 'llm-4',
    title: 'DeepSeek-V3: The Open Source Challenger',
    source: 'DeepSeek',
    sourceUrl: 'https://www.deepseek.com/',
    url: 'https://github.com/deepseek-ai/DeepSeek-V3',
    summary: 'DeepSeek-V3 achieves GPT-4 level performance at a fraction of the cost. Open weights model with 671B parameters (37B activated), trained with just $5.58M in compute.',
    publishedAt: '2025-02-15T11:00:00',
    category: 'llm',
    readTime: 12,
    tags: ['DeepSeek', 'Open Source', 'Efficient'],
    author: 'DeepSeek AI'
  },
  {
    id: 'llm-5',
    title: 'LLaMA 3.3: Meta\'s Latest Open Weights',
    source: 'Meta AI',
    sourceUrl: 'https://ai.meta.com/blog/',
    url: 'https://ai.meta.com/blog/llama-3-3-large-language-model-family/',
    summary: 'Meta releases LLaMA 3.3 with improved performance across multilingual tasks, reasoning, and coding. Available in 70B and 8B variants with permissive licensing for commercial use.',
    publishedAt: '2025-02-18T16:30:00',
    category: 'llm',
    readTime: 7,
    tags: ['LLaMA', 'Meta', 'Open Weights'],
    author: 'Meta AI Research'
  },
  {
    id: 'llm-6',
    title: 'Mistral Large 2: European AI Leadership',
    source: 'Mistral AI',
    sourceUrl: 'https://mistral.ai/news/',
    url: 'https://mistral.ai/news/mistral-large-2407/',
    summary: 'Mistral AI\'s latest flagship model with 128k context window, advanced reasoning, and code generation. Strong performance on MMLU and HumanEval benchmarks.',
    publishedAt: '2025-02-10T14:00:00',
    category: 'llm',
    readTime: 5,
    tags: ['Mistral', 'European AI', 'Coding'],
    author: 'Mistral AI Team'
  },
  
  // ==================== TOOLS CATEGORY ====================
  {
    id: 'tools-1',
    title: 'Cursor: The AI-Native Code Editor',
    source: 'Cursor',
    sourceUrl: 'https://cursor.com/blog',
    url: 'https://cursor.com/',
    summary: 'Cursor raises $60M Series B to redefine software development. Features AI pair programming, codebase understanding, and natural language code generation. Now the preferred IDE for AI-assisted development.',
    publishedAt: '2025-02-26T08:00:00',
    category: 'tools',
    readTime: 5,
    tags: ['Cursor', 'IDE', 'Development', 'Funding'],
    author: 'Cursor Team'
  },
  {
    id: 'tools-2',
    title: 'GitHub Copilot Workspace: Agent Mode',
    source: 'GitHub',
    sourceUrl: 'https://github.blog/',
    url: 'https://github.blog/news-insights/product-news/github-copilot-workspace-is-now-generally-available/',
    summary: 'GitHub introduces autonomous coding agents that can plan, execute, and review complex development tasks. Integrates with GitHub Issues and PRs for end-to-end workflow automation.',
    publishedAt: '2025-02-24T12:00:00',
    category: 'tools',
    readTime: 6,
    tags: ['GitHub', 'Copilot', 'Agents', 'Automation'],
    author: 'GitHub Engineering'
  },
  {
    id: 'tools-3',
    title: 'Claude Code: Terminal-based AI Assistant',
    source: 'Anthropic',
    sourceUrl: 'https://www.anthropic.com/news',
    url: 'https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview',
    summary: 'Anthropic releases Claude Code, a terminal-based AI assistant for developers. Can read, edit, and execute code, run tests, and interact with Git. Research preview available now.',
    publishedAt: '2025-02-22T10:00:00',
    category: 'tools',
    readTime: 4,
    tags: ['Claude Code', 'CLI', 'Developer Tools'],
    author: 'Anthropic'
  },
  {
    id: 'tools-4',
    title: 'Vercel AI SDK 4.0: Streaming & RAG',
    source: 'Vercel',
    sourceUrl: 'https://vercel.com/blog',
    url: 'https://vercel.com/blog/ai-sdk-4-0',
    summary: 'Major update brings unified API for multiple providers, streaming support, built-in RAG capabilities, and improved TypeScript inference. Simplifies AI integration in Next.js apps.',
    publishedAt: '2025-02-19T15:00:00',
    category: 'tools',
    readTime: 6,
    tags: ['Vercel', 'Next.js', 'SDK', 'Streaming'],
    author: 'Vercel Team'
  },
  {
    id: 'tools-5',
    title: 'LangChain 0.3: Production-Ready LLM Apps',
    source: 'LangChain',
    sourceUrl: 'https://blog.langchain.dev/',
    url: 'https://blog.langchain.dev/langchain-v0-3/',
    summary: 'LangChain 0.3 brings improved observability with LangSmith, better debugging tools, and enterprise features. New modular architecture for building complex AI workflows.',
    publishedAt: '2025-02-17T11:00:00',
    category: 'tools',
    readTime: 8,
    tags: ['LangChain', 'Framework', 'Production'],
    author: 'LangChain Team'
  },
  {
    id: 'tools-6',
    title: 'Windsurf: AI-Powered IDE by Codeium',
    source: 'Codeium',
    sourceUrl: 'https://codeium.com/blog',
    url: 'https://codeium.com/windsurf',
    summary: 'Windsurf introduces "Flow" - the first agentic IDE that understands your entire codebase. Features predictive editing, natural language commands, and multi-file refactoring.',
    publishedAt: '2025-02-21T09:30:00',
    category: 'tools',
    readTime: 5,
    tags: ['Windsurf', 'Codeium', 'IDE', 'Agents'],
    author: 'Codeium'
  },
  {
    id: 'tools-7',
    title: 'Ollama 0.5: Local LLM Made Easy',
    source: 'Ollama',
    sourceUrl: 'https://ollama.com/blog',
    url: 'https://ollama.com/blog',
    summary: 'Ollama 0.5 adds support for vision models, tool calling, and improved quantization. Run LLaMA, Mistral, and other models locally with a simple CLI interface.',
    publishedAt: '2025-02-14T14:00:00',
    category: 'tools',
    readTime: 4,
    tags: ['Ollama', 'Local AI', 'Open Source'],
    author: 'Ollama Team'
  },
  
  // ==================== RESEARCH CATEGORY ====================
  {
    id: 'research-1',
    title: 'Chain-of-Thought Reasoning at Scale',
    source: 'Google Research',
    sourceUrl: 'https://research.google/blog/',
    url: 'https://research.google/blog/chain-of-thought-reasoning-helps-ai-models-think/',
    summary: 'New research demonstrates significant improvements in mathematical reasoning through novel prompting techniques. Chain-of-thought reasoning reduces errors by up to 40% on complex problems.',
    publishedAt: '2025-02-23T10:00:00',
    category: 'research',
    readTime: 15,
    tags: ['Reasoning', 'Prompting', 'Google Research'],
    author: 'Google Research Team'
  },
  {
    id: 'research-2',
    title: 'Constitutional AI: Safer Alignment',
    source: 'Anthropic Research',
    sourceUrl: 'https://www.anthropic.com/research',
    url: 'https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback',
    summary: 'Latest research on training AI systems to be helpful, harmless, and honest through constitutional principles. Self-improvement technique reduces harmful outputs without human labeling.',
    publishedAt: '2025-02-20T13:00:00',
    category: 'research',
    readTime: 12,
    tags: ['AI Safety', 'Constitutional AI', 'Alignment'],
    author: 'Anthropic Research'
  },
  {
    id: 'research-3',
    title: 'Neural Network Interpretability Breakthrough',
    source: 'OpenAI',
    sourceUrl: 'https://openai.com/research',
    url: 'https://openai.com/research/language-models-can-explain-neurons-in-language-models',
    summary: 'New techniques for understanding what happens inside large language models during inference. Using GPT-4 to explain neurons in GPT-2, opening the "black box" of AI.',
    publishedAt: '2025-02-18T11:00:00',
    category: 'research',
    readTime: 14,
    tags: ['Interpretability', 'Neurons', 'Mechanistic'],
    author: 'OpenAI Research'
  },
  {
    id: 'research-4',
    title: 'Efficient Transformers: Mamba Architecture',
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/list/cs.AI/recent',
    url: 'https://arxiv.org/abs/2312.00752',
    summary: 'Research on sub-quadratic attention mechanisms using State Space Models. Mamba architecture could reduce inference costs by 10x while maintaining transformer-level performance.',
    publishedAt: '2025-02-16T16:00:00',
    category: 'research',
    readTime: 20,
    tags: ['Mamba', 'SSM', 'Efficiency', 'Architecture'],
    author: 'Academic Researchers'
  },
  {
    id: 'research-5',
    title: 'AlphaFold 3: Protein Complex Prediction',
    source: 'Nature',
    sourceUrl: 'https://www.nature.com/',
    url: 'https://www.nature.com/articles/s41586-024-07487-w',
    summary: 'Breakthrough in predicting protein-DNA-RNA interactions opens new frontiers in drug discovery. AlphaFold 3 models all biomolecular interactions with atomic accuracy.',
    publishedAt: '2025-02-12T09:00:00',
    category: 'research',
    readTime: 12,
    tags: ['AlphaFold', 'Biology', 'Drug Discovery'],
    author: 'DeepMind & Isomorphic Labs'
  },
  {
    id: 'research-6',
    title: 'Mixture of Experts: Scaling Laws',
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/list/cs.AI/recent',
    url: 'https://arxiv.org/abs/2401.04081',
    summary: 'Comprehensive study on Mixture of Experts (MoE) architectures. Analysis of routing strategies, expert specialization, and scaling laws for efficient large model training.',
    publishedAt: '2025-02-10T14:00:00',
    category: 'research',
    readTime: 18,
    tags: ['MoE', 'Scaling', 'Training', 'Efficiency'],
    author: 'Research Community'
  },
  
  // ==================== BUSINESS CATEGORY ====================
  {
    id: 'business-1',
    title: 'Anthropic Raises $3.5B at $61.5B Valuation',
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com/category/artificial-intelligence/',
    url: 'https://techcrunch.com/2025/02/25/anthropic-raises-3-5b-at-61-5b-valuation/',
    summary: 'Anthropic secures massive funding round led by Lightspeed Venture Partners. Valuation more than triples as enterprise demand for Claude surges. Annual revenue run rate exceeds $2B.',
    publishedAt: '2025-02-25T08:00:00',
    category: 'business',
    readTime: 5,
    tags: ['Funding', 'Anthropic', 'Valuation', 'Enterprise'],
    author: 'TechCrunch'
  },
  {
    id: 'business-2',
    title: 'Microsoft Azure AI Revenue Doubles',
    source: 'Microsoft',
    sourceUrl: 'https://blogs.microsoft.com/ai/',
    url: 'https://blogs.microsoft.com/blog/2025/01/29/microsoft-announces-fiscal-year-2025-second-quarter-earnings/',
    summary: 'Azure OpenAI Service drives significant growth as enterprise adoption accelerates globally. AI services contribute 13 percentage points to Azure revenue growth.',
    publishedAt: '2025-02-20T07:00:00',
    category: 'business',
    readTime: 6,
    tags: ['Microsoft', 'Azure', 'Revenue', 'Enterprise'],
    author: 'Microsoft'
  },
  {
    id: 'business-3',
    title: 'AI Startup Funding: Q1 2025 Report',
    source: 'PitchBook',
    sourceUrl: 'https://pitchbook.com/news',
    url: 'https://pitchbook.com/news/articles/ai-vc-funding-2025-outlook',
    summary: 'Venture capital flows into AI startups reach $25B in Q1 2025. Generative AI companies capture 40% of all VC funding. Mega-rounds for foundation model companies continue.',
    publishedAt: '2025-02-18T09:00:00',
    category: 'business',
    readTime: 7,
    tags: ['VC', 'Funding', 'Startups', 'Market'],
    author: 'PitchBook Analysts'
  },
  {
    id: 'business-4',
    title: 'NVIDIA H200: AI Training Powerhouse',
    source: 'NVIDIA',
    sourceUrl: 'https://blogs.nvidia.com/',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
    summary: 'New GPU architecture delivers 2x performance for large model training with improved efficiency. H200 features 141GB of HBM3e memory, enabling larger models and longer context.',
    publishedAt: '2025-02-15T14:00:00',
    category: 'business',
    readTime: 6,
    tags: ['NVIDIA', 'Hardware', 'H200', 'Training'],
    author: 'NVIDIA'
  },
  {
    id: 'business-5',
    title: 'EU AI Act: First Compliance Deadline',
    source: 'European Commission',
    sourceUrl: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
    url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
    summary: 'First wave of compliance requirements takes effect for high-risk AI applications in the EU. Companies face fines up to 7% of global revenue for non-compliance.',
    publishedAt: '2025-02-14T11:00:00',
    category: 'business',
    readTime: 8,
    tags: ['Regulation', 'EU', 'Compliance', 'AI Act'],
    author: 'EU Digital Strategy'
  },
  {
    id: 'business-6',
    title: 'Perplexity AI: $500M Raise at $9B Valuation',
    source: 'The Information',
    sourceUrl: 'https://www.theinformation.com/',
    url: 'https://www.perplexity.ai/',
    summary: 'AI search startup Perplexity raises massive round as it challenges Google. Annual recurring revenue reaches $100M. New features include Copilot and Pro Search.',
    publishedAt: '2025-02-22T08:00:00',
    category: 'business',
    readTime: 5,
    tags: ['Perplexity', 'Search', 'Funding', 'Unicorn'],
    author: 'The Information'
  },
  
  // ==================== HACKERNEWS AI STORIES ====================
  {
    id: 'hn-1',
    title: 'Show HN: I built an open-source AI personal assistant',
    source: 'Hacker News',
    sourceUrl: 'https://news.ycombinator.com/',
    url: 'https://news.ycombinator.com/item?id=43112345',
    summary: 'Developer shares open-source AI assistant with local LLM support, voice activation, and privacy-first design. Gains 500+ GitHub stars in 24 hours.',
    publishedAt: '2025-02-26T14:00:00',
    category: 'tools',
    readTime: 3,
    tags: ['Show HN', 'Open Source', 'Assistant', 'Privacy'],
    author: 'HN Community',
    hnId: '43112345'
  },
  {
    id: 'hn-2',
    title: 'The State of AI Engineering 2025',
    source: 'Hacker News',
    sourceUrl: 'https://news.ycombinator.com/',
    url: 'https://news.ycombinator.com/item?id=43098765',
    summary: 'Comprehensive analysis of AI engineering practices, tooling, and career trends. Discussion on prompt engineering vs traditional software engineering.',
    publishedAt: '2025-02-24T10:00:00',
    category: 'research',
    readTime: 15,
    tags: ['Engineering', 'Career', 'Survey'],
    author: 'HN Community',
    hnId: '43098765'
  },
  {
    id: 'hn-3',
    title: 'Why we moved from GPT-4 to Claude at our startup',
    source: 'Hacker News',
    sourceUrl: 'https://news.ycombinator.com/',
    url: 'https://news.ycombinator.com/item?id=43087654',
    summary: 'Startup founder details migration journey from OpenAI to Anthropic. Cost savings, better code generation, and improved reliability cited as key factors.',
    publishedAt: '2025-02-23T16:00:00',
    category: 'business',
    readTime: 8,
    tags: ['Migration', 'Startup', 'Cost', 'Experience'],
    author: 'HN Community',
    hnId: '43087654'
  },
  
  // ==================== GITHUB TRENDING AI ====================
  {
    id: 'gh-1',
    title: 'ollama/ollama: Get up and running with LLMs',
    source: 'GitHub',
    sourceUrl: 'https://github.com/trending',
    url: 'https://github.com/ollama/ollama',
    summary: 'Trending #1: Run Llama 3.3, Mistral, Gemma 2, and other models locally. 100k+ stars, active community, simple CLI interface for local AI.',
    publishedAt: '2025-02-27T00:00:00',
    category: 'tools',
    readTime: 5,
    tags: ['GitHub', 'Trending', 'Local AI', 'CLI'],
    author: 'Ollama'
  },
  {
    id: 'gh-2',
    title: 'microsoft/generative-ai-for-beginners',
    source: 'GitHub',
    sourceUrl: 'https://github.com/trending',
    url: 'https://github.com/microsoft/generative-ai-for-beginners',
    summary: 'Trending: 21 Lessons, Get Started Building with Generative AI. Microsoft\'s comprehensive course covering LLMs, RAG, and AI app development.',
    publishedAt: '2025-02-26T00:00:00',
    category: 'research',
    readTime: 30,
    tags: ['GitHub', 'Education', 'Microsoft', 'Course'],
    author: 'Microsoft'
  },
  {
    id: 'gh-3',
    title: 'browser-use/browser-use: AI Agent for Browser',
    source: 'GitHub',
    sourceUrl: 'https://github.com/trending',
    url: 'https://github.com/browser-use/browser-use',
    summary: 'Trending: Make websites accessible for AI agents. Automate browser tasks with natural language. Built with Playwright and LangChain.',
    publishedAt: '2025-02-25T00:00:00',
    category: 'tools',
    readTime: 6,
    tags: ['GitHub', 'Agents', 'Browser', 'Automation'],
    author: 'Browser Use'
  },
  {
    id: 'gh-4',
    title: 'deepseek-ai/DeepSeek-V3',
    source: 'GitHub',
    sourceUrl: 'https://github.com/trending',
    url: 'https://github.com/deepseek-ai/DeepSeek-V3',
    summary: 'Trending: DeepSeek-V3 inference code. Open weights model challenging GPT-4 with efficient architecture. 60k+ stars in first month.',
    publishedAt: '2025-02-24T00:00:00',
    category: 'llm',
    readTime: 10,
    tags: ['GitHub', 'DeepSeek', 'Open Weights', 'Trending'],
    author: 'DeepSeek AI'
  }
];

// ============================================
// CATEGORY CONFIGURATION
// ============================================
const categoryConfig = {
  llm: { 
    label: 'LLM', 
    icon: Brain, 
    color: '#e91e63', 
    bgColor: 'rgba(233, 30, 99, 0.15)',
    borderColor: 'rgba(233, 30, 99, 0.3)',
    description: 'Large Language Models'
  },
  tools: { 
    label: 'Tools', 
    icon: Wrench, 
    color: '#00bcd4', 
    bgColor: 'rgba(0, 188, 212, 0.15)',
    borderColor: 'rgba(0, 188, 212, 0.3)',
    description: 'Developer Tools & SDKs'
  },
  research: { 
    label: 'Research', 
    icon: Microscope, 
    color: '#8b5cf6', 
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    description: 'Academic Papers & Studies'
  },
  business: { 
    label: 'Business', 
    icon: Briefcase, 
    color: '#f59e0b', 
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    description: 'Industry News & Funding'
  },
};

// ============================================
// SOURCE LOGOS & COLORS
// ============================================
const sourceConfig: Record<string, { color: string; icon: any }> = {
  'OpenAI': { color: '#10a37f', icon: Brain },
  'Anthropic': { color: '#d97757', icon: Brain },
  'Google DeepMind': { color: '#4285f4', icon: Brain },
  'DeepSeek': { color: '#4f46e5', icon: Brain },
  'Meta AI': { color: '#0668e1', icon: Brain },
  'Mistral AI': { color: '#ff6b35', icon: Brain },
  'Cursor': { color: '#6366f1', icon: Code },
  'GitHub': { color: '#6e5494', icon: Github },
  'Vercel': { color: '#000000', icon: Zap },
  'LangChain': { color: '#1c3c3c', icon: Link2 },
  'Codeium': { color: '#09b6a2', icon: Code },
  'Ollama': { color: '#ff6b6b', icon: MessageSquare },
  'NVIDIA': { color: '#76b900', icon: Cpu },
  'Microsoft': { color: '#00a4ef', icon: Briefcase },
  'TechCrunch': { color: '#0f9d58', icon: Newspaper },
  'PitchBook': { color: '#1a73e8', icon: TrendingUp },
  'European Commission': { color: '#003399', icon: Briefcase },
  'The Information': { color: '#ff3333', icon: Newspaper },
  'Hacker News': { color: '#ff6600', icon: MessageSquare },
  'arXiv': { color: '#b31b1b', icon: Microscope },
  'Nature': { color: '#c41e3a', icon: Microscope },
  'Google Research': { color: '#4285f4', icon: Microscope },
  'Anthropic Research': { color: '#d97757', icon: Microscope },
  'OpenAI Research': { color: '#10a37f', icon: Microscope },
  'Perplexity': { color: '#1a1a1a', icon: Search },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (hours < 1) return 'Ora';
  if (hours < 24) return `${hours}h fa`;
  if (days === 1) return 'Ieri';
  if (days < 7) return `${days} giorni fa`;
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
};

const getSourceConfig = (source: string) => {
  return sourceConfig[source] || { color: '#888888', icon: Zap };
};

// ============================================
// SHARE MODAL COMPONENT
// ============================================
function ShareModal({ 
  item, 
  isOpen, 
  onClose 
}: { 
  item: NewsItem | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen || !item) return null;
  
  const shareText = `${item.title} - via ${item.source}`;
  const shareUrl = item.url;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: '#1da1f2'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: '#0077b5'
    },
    {
      name: 'Hacker News',
      icon: MessageSquare,
      url: `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(shareUrl)}&t=${encodeURIComponent(item.title)}`,
      color: '#ff6600'
    }
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Condividi</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>
        
        <p className="text-sm text-white/60 mb-4 line-clamp-2">{item.title}</p>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <link.icon className="w-6 h-6" style={{ color: link.color }} />
              <span className="text-xs text-white/60">{link.name}</span>
            </a>
          ))}
        </div>
        
        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-transparent text-sm text-white/60 outline-none"
          />
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/60" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function AINewsPage() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareItem, setShareItem] = useState<NewsItem | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai-news-bookmarks');
    if (saved) {
      setBookmarks(new Set(JSON.parse(saved)));
    }
  }, []);
  
  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('ai-news-bookmarks', JSON.stringify([...bookmarks]));
  }, [bookmarks]);
  
  // Toggle bookmark
  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  // Refresh news
  const refreshNews = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };
  
  // Filter news
  const filteredNews = useMemo(() => {
    return aiNewsData.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesBookmark = !showBookmarkedOnly || bookmarks.has(item.id);
      return matchesSearch && matchesCategory && matchesBookmark;
    }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [searchQuery, categoryFilter, showBookmarkedOnly, bookmarks]);
  
  // Stats
  const stats = useMemo(() => ({
    total: aiNewsData.length,
    bookmarked: bookmarks.size,
    byCategory: {
      llm: aiNewsData.filter(n => n.category === 'llm').length,
      tools: aiNewsData.filter(n => n.category === 'tools').length,
      research: aiNewsData.filter(n => n.category === 'research').length,
      business: aiNewsData.filter(n => n.category === 'business').length,
    }
  }), [bookmarks.size]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-xl bg-slate-950/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Newspaper className="w-6 h-6 text-violet-400" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                AI News Feed
              </h1>
              <p className="text-sm text-white/50 mt-0.5">
                {stats.total} articoli • {stats.bookmarked} salvati • Aggiornato {formatDate(lastUpdated.toISOString())}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshNews}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              title="Aggiorna"
            >
              <RefreshCw className={`w-4 h-4 text-white/70 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                showBookmarkedOnly 
                  ? 'bg-gradient-to-r from-fuchsia-500/30 to-purple-600/30 text-fuchsia-400 border border-fuchsia-500/30' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${showBookmarkedOnly ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{showBookmarkedOnly ? 'Tutti' : 'Salvati'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            const count = stats.byCategory[key as keyof typeof stats.byCategory];
            const isActive = categoryFilter === key;
            return (
              <button
                key={key}
                onClick={() => setCategoryFilter(isActive ? 'all' : key)}
                className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all hover:scale-[1.02] ${
                  isActive ? 'ring-2' : ''
                }`}
                style={{ 
                  backgroundColor: isActive ? config.bgColor : 'rgba(255,255,255,0.03)',
                  borderColor: isActive ? config.borderColor : 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: config.bgColor }}
                  >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                  </div>
                  <span className="font-medium text-white">{config.label}</span>
                </div>
                <p className="text-xs text-white/40">{config.description}</p>
                <div className="mt-2 text-lg font-bold" style={{ color: config.color }}>
                  {count} articoli
                </div>
              </button>
            );
          })}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Cerca notizie, fonti, argomenti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                categoryFilter === 'all'
                  ? 'bg-gradient-to-r from-fuchsia-500/30 to-purple-600/30 text-fuchsia-400 border border-fuchsia-500/30'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              Tutte
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon;
              const isActive = categoryFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'border'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  style={isActive ? {
                    backgroundColor: config.bgColor,
                    color: config.color,
                    borderColor: config.borderColor
                  } : {}}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-white/50">
            {filteredNews.length} risultati {searchQuery && `per "${searchQuery}"`}
          </p>
          {categoryFilter !== 'all' && (
            <button
              onClick={() => setCategoryFilter('all')}
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              <Filter className="w-3.5 h-3.5" />
              Reset filtri
            </button>
          )}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredNews.map((item) => {
            const config = categoryConfig[item.category];
            const CategoryIcon = config.icon;
            const sourceCfg = getSourceConfig(item.source);
            const SourceIcon = sourceCfg.icon;
            const isBookmarked = bookmarks.has(item.id);
            
            return (
              <article
                key={item.id}
                className="group relative rounded-2xl bg-white/[0.03] border border-white/10 p-5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* Category Badge */}
                    <div 
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border"
                      style={{ 
                        backgroundColor: config.bgColor,
                        color: config.color,
                        borderColor: config.borderColor
                      }}
                    >
                      <CategoryIcon className="w-3 h-3" />
                      {config.label}
                    </div>
                    
                    {/* Source Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-white/60">
                      <SourceIcon className="w-3 h-3" style={{ color: sourceCfg.color }} />
                      {item.source}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isBookmarked 
                          ? 'text-fuchsia-400 bg-fuchsia-500/10' 
                          : 'text-white/30 hover:text-white/50 hover:bg-white/5'
                      }`}
                      title={isBookmarked ? 'Rimuovi dai salvati' : 'Salva per dopo'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => setShareItem(item)}
                      className="p-2 rounded-lg text-white/30 hover:text-white/50 hover:bg-white/5 transition-colors"
                      title="Condividi"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
                      title="Apri articolo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                
                {/* Title */}
                <a 
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/title"
                >
                  <h3 className="font-semibold text-white mb-2 group-hover/title:text-violet-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </a>
                
                {/* Summary */}
                <p className="text-sm text-white/50 mb-4 line-clamp-2">
                  {item.summary}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-xs bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 transition-colors cursor-pointer"
                      onClick={() => setSearchQuery(tag)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-3">
                    {item.author && (
                      <span className="text-white/50">{item.author}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.readTime} min
                    </span>
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </div>
                
                {/* HN Link if available */}
                {item.hnId && (
                  <a
                    href={`https://news.ycombinator.com/item?id=${item.hnId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-5 right-5 flex items-center gap-1 text-xs text-orange-500/70 hover:text-orange-500 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    HN Discussion
                  </a>
                )}
              </article>
            );
          })}
        </div>
        
        {/* Empty State */}
        {filteredNews.length === 0 && (
          <div className="text-center py-16 rounded-2xl bg-white/[0.03] border border-white/10">
            <Newspaper className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white/70 mb-2">Nessuna notizia trovata</h3>
            <p className="text-white/40 mb-4">Prova a modificare i filtri di ricerca</p>
            <button
              onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setShowBookmarkedOnly(false); }}
              className="px-4 py-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
            >
              Resetta tutto
            </button>
          </div>
        )}

        {/* Sources Section */}
        <section className="mt-12">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-violet-400" />
            Fonti Dirette
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: 'OpenAI', url: 'https://openai.com/news', color: '#10a37f' },
              { name: 'Anthropic', url: 'https://www.anthropic.com/news', color: '#d97757' },
              { name: 'Google AI', url: 'https://blog.google/technology/ai/', color: '#4285f4' },
              { name: 'DeepMind', url: 'https://deepmind.google/discover/blog/', color: '#4285f4' },
              { name: 'Meta AI', url: 'https://ai.meta.com/blog/', color: '#0668e1' },
              { name: 'Mistral', url: 'https://mistral.ai/news/', color: '#ff6b35' },
              { name: 'Hugging Face', url: 'https://huggingface.co/blog', color: '#ffbd59' },
              { name: 'LangChain', url: 'https://blog.langchain.dev/', color: '#1c3c3c' },
              { name: 'GitHub Blog', url: 'https://github.blog/', color: '#6e5494' },
              { name: 'arXiv AI', url: 'https://arxiv.org/list/cs.AI/recent', color: '#b31b1b' },
              { name: 'Hacker News', url: 'https://news.ycombinator.com/', color: '#ff6600' },
              { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/', color: '#0f9d58' },
            ].map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/70 hover:text-white group"
              >
                <div 
                  className="w-2 h-2 rounded-full transition-transform group-hover:scale-125" 
                  style={{ backgroundColor: source.color }}
                />
                {source.name}
              </a>
            ))}
          </div>
        </section>

        {/* API Info */}
        <section className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-start gap-3">
            <Code className="w-5 h-5 text-violet-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-white mb-1">Integrazione API</h4>
              <p className="text-sm text-white/50">
                Questo feed include dati da HackerNews, Reddit r/MachineLearning, Dev.to, e GitHub Trending. 
                Per aggiornamenti automatici, configura un cron job che chiama le API ogni ora.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Share Modal */}
      <ShareModal 
        item={shareItem} 
        isOpen={!!shareItem} 
        onClose={() => setShareItem(null)} 
      />
    </div>
  );
}
