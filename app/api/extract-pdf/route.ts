import pdfParse from "pdf-parse"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "File must be a PDF" },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const data = await pdfParse(buffer)
    
    return Response.json({ text: data.text })
  } catch (error) {
    console.error("PDF extraction error:", error)
    return Response.json(
      { error: "Failed to extract text from PDF" },
      { status: 500 }
    )
  }
}
