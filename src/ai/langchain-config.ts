// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

// Configuration schema for LangChain
export const LangChainConfigSchema = z.object({
  apiKey: z.string().default(""),
  modelName: z.string().default("llama-3.3-70b-versatile"), // Updated default for Groq
  temperature: z.number().min(0).max(2).default(0.7),
  maxOutputTokens: z.number().min(1).default(8192), // Higher limit for Llama
});

export type LangChainConfig = z.infer<typeof LangChainConfigSchema>;

// Default configuration settings (not including secrets)
const defaultSettings = {
  modelName: "llama-3.3-70b-versatile",
  temperature: 0.7,
  maxOutputTokens: 8192,
};

// Validate and get configuration
export function getLangChainConfig(): LangChainConfig {
  try {
    const config = {
      // Use GROQ_API_KEY if available, otherwise fall back to GEMINI (though we are switching provider completely)
      apiKey: process.env.GROQ_API_KEY || "", 
      ...defaultSettings
    };
    
    if (!config.apiKey) {
      console.warn("GROQ_API_KEY not found in environment variables");
    }
    
    return LangChainConfigSchema.parse(config);
  } catch (error) {
    console.error("Invalid LangChain configuration:", error);
    // Return default config with empty key instead of throwing error
    return {
      apiKey: "",
      ...defaultSettings
    };
  }
}


// Create LangChain model instance
export function createLangChainModel() {
  const config = getLangChainConfig();
  
  if (!config.apiKey) {
    throw new Error("GROQ_API_KEY is required but not configured");
  }
  
  return new ChatGroq({
    apiKey: config.apiKey,
    model: config.modelName,
    temperature: config.temperature,
    maxTokens: config.maxOutputTokens, // Groq uses 'maxTokens'
    maxRetries: 2,
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
