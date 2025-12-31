import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

// Configuration schema for LangChain
export const LangChainConfigSchema = z.object({
  apiKey: z.string().default(""),
  provider: z.enum(["groq", "gemini"]).default("gemini"),
  modelName: z.string().default("gemini-flash-latest"), 
  temperature: z.number().min(0).max(2).default(0.7),
  maxOutputTokens: z.number().min(1).default(8192),
});

export type LangChainConfig = z.infer<typeof LangChainConfigSchema>;

// Default configuration settings (not including secrets)
const defaultSettings = {
  modelName: "gemini-flash-latest",
  temperature: 0.7,
  maxOutputTokens: 8192,
  provider: "gemini" as const,
};

// Validate and get configuration
export function getLangChainConfig(): LangChainConfig {
  try {
    // Prioritize Gemini if available
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    let config: any = { ...defaultSettings };

    if (geminiKey) {
      config.apiKey = geminiKey;
      config.provider = "gemini";
      config.modelName = "gemini-flash-latest"; // Ensure we use the best model
    } else if (groqKey) {
      config.apiKey = groqKey;
      config.provider = "groq";
      config.modelName = "llama-3.1-8b-instant";
    } else {
      config.apiKey = "";
    }
    
    if (!config.apiKey) {
      console.warn("No AI API key found (checked GEMINI_API_KEY and GROQ_API_KEY)");
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


// Create LangChain model instance (uses default model from config)
export function createLangChainModel() {
  const config = getLangChainConfig();
  
  if (!config.apiKey) {
    throw new Error("AI API key is required but not configured");
  }

  if (config.provider === "gemini") {
    return new ChatGoogleGenerativeAI({
      apiKey: config.apiKey,
      model: config.modelName,
      temperature: config.temperature,
      maxOutputTokens: config.maxOutputTokens,
      maxRetries: 2,
    });
  }
  
  return new ChatGroq({
    apiKey: config.apiKey,
    model: config.modelName,
    temperature: config.temperature,
    maxTokens: config.maxOutputTokens, // Groq uses 'maxTokens'
    maxRetries: 2,
  });
}

// Create LangChain model with a SPECIFIC model name
// Use this for hybrid approach: Step 1 = flash, Step 2 = flash-lite
export function createLangChainModelWithName(modelName: string) {
  const config = getLangChainConfig();
  
  if (!config.apiKey) {
    throw new Error("AI API key is required but not configured");
  }

  if (config.provider === "gemini") {
    return new ChatGoogleGenerativeAI({
      apiKey: config.apiKey,
      model: modelName, // Use the specified model name
      temperature: config.temperature,
      maxOutputTokens: config.maxOutputTokens,
      maxRetries: 2,
    });
  }
  
  // For non-Gemini providers, fall back to default
  return new ChatGroq({
    apiKey: config.apiKey,
    model: config.modelName,
    temperature: config.temperature,
    maxTokens: config.maxOutputTokens,
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
