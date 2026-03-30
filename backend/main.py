import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import openai

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY in backend/.env")

openai.api_key = OPENAI_API_KEY

app = FastAPI(
    title="Resume Analyzer API",
    description="AI-powered resume analysis using GPT-4o",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] ,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResumeRequest(BaseModel):
    resumeText: str
    jobDescription: str = ""

@app.get("/")
async def health_check():
    return {"message": "Resume Analyzer API running"}

@app.post("/api/analyze")
async def analyze_resume(req: ResumeRequest):
    if not req.resumeText or req.resumeText.strip() == "":
        raise HTTPException(status_code=400, detail="resumeText is required")

    prompt = f"""Analyze the resume and return:
1. Overall ATS Score (out of 100)
2. Skill Gaps
3. Strengths
4. Improvement Suggestions
5. Job Match Score

Resume:
{req.resumeText}

Job Description:
{req.jobDescription}
"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a resume analyst."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=800,
        )

        text = response.choices[0].message["content"].strip()
        return {"analysis": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)
