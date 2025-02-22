import { GoogleGenerativeAI } from "@google/generative-ai";

interface AIAnalysis {
  summary: string;
  overallSentiment: number;
  ticker: string;
  postAnalyses: {
    text: string;
    sentiment: number;
    explanation: string;
  }[];
  filteredPosts?: {
    title: string;
    reason: string;
  }[];
}

class GoogleAIService {
  private genAI: GoogleGenerativeAI;
  private model: any; // TODO: Add proper type when available
  private readonly MAX_WORDS = 500; // Maximum words per post

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.NEXT_PRIVATE_GOOGLE_AI_STUDIO_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  private isPostTooLong(post: { title: string; text: string }): boolean {
    const totalWords = this.countWords(post.title) + this.countWords(post.text);
    return totalWords > this.MAX_WORDS;
  }

  async analyzeRedditPosts(posts: { title: string; text: string }[], ticker: string): Promise<AIAnalysis> {
    // Track filtered posts
    const filteredPostsInfo: { title: string; reason: string }[] = [];
    const filteredPosts = posts.filter(post => {
      if (this.isPostTooLong(post)) {
        const words = this.countWords(post.title) + this.countWords(post.text);
        filteredPostsInfo.push({
          title: post.title,
          reason: `Exceeded ${this.MAX_WORDS} word limit (${words} words)`
        });
        return false;
      }
      return true;
    });

    // If no posts remain after filtering, return a default analysis
    if (filteredPosts.length === 0) {
      return {
        summary: "No suitable posts found for analysis (all posts exceeded maximum length).",
        overallSentiment: 0,
        ticker,
        postAnalyses: [],
        filteredPosts: filteredPostsInfo
      };
    }

    const prompt = `
      Analyze these Reddit posts about ${ticker} stock. Focus ONLY on sentiment related to ${ticker}, ignore other tickers mentioned.
      For each post:
      1. Determine the sentiment specifically for ${ticker} (score from -1 to 1, where -1 is very bearish and 1 is very bullish)
      2. Provide a brief explanation (max 100 characters) of why you assigned that sentiment score
      3. If a post doesn't specifically discuss ${ticker}, assign neutral sentiment (0)

      Then, provide:
      1. A brief overall summary (max 200 characters) of ${ticker} sentiment
      2. A general sentiment score (-1 to 1) based ONLY on ${ticker}-related content

      Here are the posts to analyze:
      ${filteredPosts.map((post, i) => `
        Post ${i + 1}:
        Title: ${post.title}
        Text: ${post.text}
      `).join('\n')}

      IMPORTANT: Respond ONLY with a JSON object in this EXACT format (no other text):
      {
        "summary": "Brief summary focusing on ${ticker}",
        "overallSentiment": number,
        "ticker": "${ticker}",
        "postAnalyses": [
          {
            "text": "exact post title",
            "sentiment": number,
            "explanation": "brief explanation"
          }
        ]
      }
    `.trim();

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Clean the response
      let cleanedResponse = response.trim();
      
      // Remove markdown code block if present
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\n/, '')
          .replace(/^```\n/, '')
          .replace(/\n```$/, '')
          .trim();
      }

      console.log('AI Response:', cleanedResponse); // Debug log
      
      try {
        const analysis = JSON.parse(cleanedResponse);
        
        // Validate and sanitize the response
        const sanitizedAnalysis = {
          summary: String(analysis.summary || '').slice(0, 200),
          overallSentiment: Math.max(-1, Math.min(1, Number(analysis.overallSentiment) || 0)),
          ticker: ticker,
          postAnalyses: (analysis.postAnalyses || []).map((post: any, index: number) => ({
            text: String(post.text || filteredPosts[index]?.title || ''),
            sentiment: Math.max(-1, Math.min(1, Number(post.sentiment) || 0)),
            explanation: String(post.explanation || '').slice(0, 100)
          })),
          filteredPosts: filteredPostsInfo
        };
        
        return sanitizedAnalysis;
      } catch (error) {
        console.error('AI Response Parse Error:', error);
        // Return a fallback analysis
        return {
          summary: `Failed to analyze ${ticker} posts due to technical issues.`,
          overallSentiment: 0,
          ticker,
          postAnalyses: filteredPosts.map(post => ({
            text: post.title,
            sentiment: 0,
            explanation: "Analysis failed"
          })),
          filteredPosts: filteredPostsInfo
        };
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a singleton instance
export const googleAI = new GoogleAIService(); 