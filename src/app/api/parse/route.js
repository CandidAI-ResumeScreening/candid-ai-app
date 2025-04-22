export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file upload
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Forward to Flask API
    const flaskUrl = "http://localhost:5000/parse";
    const formDataToSend = new FormData();
    formDataToSend.append("resume", file);

    const response = await fetch(flaskUrl, {
      method: "POST",
      body: formDataToSend,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to parse resume");
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
