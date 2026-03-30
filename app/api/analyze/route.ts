import { generateText, Output } from "ai"
import { z } from "zod"

const analysisSchema = z.object({
  matchScore: z.number().describe("A score from 0-100 indicating how well the resume matches the job description"),
  matchLevel: z.string().describe("A brief label like 'Excellent Match', 'Strong Match', 'Moderate Match', or 'Needs Work'"),
  skillGaps: z.array(
    z.object({
      skill: z.string().describe("The missing or weak skill"),
      priority: z.enum(["high", "medium", "low"]).describe("How important this skill is for the role"),
    })
  ).describe("Skills mentioned in the job description that are missing or weak in the resume"),
  matchedSkills: z.array(z.string()).describe("Skills that match well between the resume and job description"),
  suggestions: z.array(
    z.object({
      title: z.string().describe("A short title for the suggestion"),
      description: z.string().describe("A detailed explanation of the improvement suggestion"),
    })
  ).describe("Three specific, actionable suggestions to improve the resume for this job"),
})

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json()

    if (!resumeText || !jobDescription) {
      return Response.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      )
    }

    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
      output: Output.object({
        schema: analysisSchema,
      }),
      messages: [
        {
          role: "system",
          content: `You are an expert resume analyst and career coach. Your task is to analyze a resume against a job description and provide detailed, actionable feedback.

Be thorough but constructive in your analysis. Focus on:
1. How well the candidate's experience and skills match the job requirements
2. Missing skills or keywords that should be added
3. Specific improvements that would make the resume stronger for this role

Always provide exactly 3 suggestions for improvement. Make them specific and actionable.`,
        },
        {
          role: "user",
          content: `Please analyze this resume against the job description:

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide a comprehensive analysis including a match score (0-100), skill gaps, matched skills, and improvement suggestions.`,
        },
      ],
    })

    return Response.json({ analysis: output })
  } catch (error) {
    console.error("Analysis error:", error)
    return Response.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    )
  }
}
