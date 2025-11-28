import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

// Configuration schema for LangChain
export const LangChainConfigSchema = z.object({
  apiKey: z.string().default(""),
  modelName: z.string().default("gemini-2.0-flash"),
  temperature: z.number().min(0).max(2).default(0.7),
  maxOutputTokens: z.number().min(1).default(2048),
});

export type LangChainConfig = z.infer<typeof LangChainConfigSchema>;

// Default configuration
const defaultConfig: LangChainConfig = {
  apiKey: process.env.GEMINI_API_KEY || "",
  modelName: "gemini-2.0-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
};

// Validate and get configuration
export function getLangChainConfig(): LangChainConfig {
  try {
    const config = { ...defaultConfig };
    
    if (!config.apiKey) {
      console.warn("GEMINI_API_KEY not found in environment variables");
    }
    
    return LangChainConfigSchema.parse(config);
  } catch (error) {
    console.error("Invalid LangChain configuration:", error);
    // Return default config instead of throwing error
    return defaultConfig;
  }
}


// Create LangChain model instance
export function createLangChainModel() {
  const config = getLangChainConfig();
  
  if (!config.apiKey) {
    throw new Error("GEMINI_API_KEY is required but not configured");
  }
  
  return new ChatGoogleGenerativeAI({
    apiKey: config.apiKey,
    model: config.modelName,
    temperature: config.temperature,
    maxOutputTokens: config.maxOutputTokens,
  });
}

// Check if AI is configured without throwing errors
export function isAIConfigured(): boolean {
  try {
    const config = getLangChainConfig();
    const isConfigured = Boolean(config.apiKey && config.apiKey.length > 0);
    
    console.log("isAIConfigured() check:", isConfigured, "Key length:", config.apiKey?.length || 0);
    
    return isConfigured;
  } catch (error) {
    console.warn("Error checking AI configuration:", error);
    return false;
  }
}

// Schema for repository analysis output
export const RepositoryAnalysisOutputSchema = z.object({
  comprehensiveExplanation: z.string().describe("AI-generated comprehensive explanation of what this repository is and how it works"),
  architecturalOverview: z.string().describe("AI-generated high-level architectural overview"),
  detailedDataFlow: z.string().describe("AI-generated detailed data flow explanation"),
  keyPatterns: z.array(z.string()).describe("AI-identified key architectural patterns"),
  technicalInsights: z.array(z.string()).describe("AI-generated technical insights"),
  complexityAssessment: z.string().describe("AI-generated complexity assessment"),
  recommendations: z.array(z.string()).describe("AI-generated recommendations for improvement"),
  useCases: z.array(z.string()).describe("AI-identified common use cases"),
  enhancedIntegrations: z.array(z.string()).describe("AI-identified external integrations"),
});

export type RepositoryAnalysisOutput = z.infer<typeof RepositoryAnalysisOutputSchema>;
