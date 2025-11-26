// Maps dashboard tools to GitHub repositories
export const REPO_MAPPING = {
  ON_PAGE_JOSH_BOT: {
    repo: "SheetFreak-OnPage",
    type: "BOT",
    description: "On-page SEO automation bot",
    teams: ["Specialists", "Content"],
  },
  RANDY_PEM_DASH: {
    repo: "Randy",
    type: "DASH",
    description: "Randy PEM Dashboard",
    teams: ["Specialists", "Content"],
  },
  LEAD: {
    repo: "Lead",
    type: "TOOL",
    description: "Lead generation and management tool",
    teams: ["Sales"],
  },
  LSI_ANALYZER: {
    repo: "LSI",
    type: "SEO",
    description: "LSI keyword analysis tool",
    teams: ["Content", "Specialists"],
  },
  PEM: {
    repo: "Product-Enrichment-Manager",
    type: "TOOL",
    description: "Product Enrichment Manager - metadata management",
    teams: ["GMC"],
  },
  SHEETFREAK: {
    repo: "SheetFreak",
    type: "TOOL",
    description: "CLI tool for programmatic Google Sheets control",
    teams: ["Specialists", "Content"],
  },
  CLAUDE_CODE_BOOTSTRAP: {
    repo: "claude-code-bootstrap",
    type: "TOOL",
    description: "Smart bootstrap system for Claude Code projects",
    teams: ["Tech"],
  },
};

// Archived projects - dead/discontinued projects
export const ARCHIVED_REPOS = {
  "[ARCHIVED] TITLE_STRUCT": {
    repo: "titlestruct",
    type: "DASH",
    description: "GMC Title Structure Dashboard - DISCONTINUED",
    archivedDate: "2025-09-19",
  },
  "[ARCHIVED] ECOM_PRICE_TRACKER": {
    repo: "Ecom-price-tracker",
    type: "SCRAPE",
    description: "Competitor price tracking - DISCONTINUED",
    archivedDate: "2025-10-27",
  },
};

export const GITHUB_CONFIG = {
  owner: "C9-Tech-GtitHub",
  baseUrl: "https://github.com/C9-Tech-GtitHub",
};
