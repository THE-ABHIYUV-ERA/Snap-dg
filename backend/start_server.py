import uvicorn

if __name__ == "__main__":
    print("🚀 Starting Impactor-2025 Backend Server...")
    print("📊 API will be available at: http://localhost:8000")
    print("📚 Documentation at: http://localhost:8000/docs")
    print("Press Ctrl+C to stop the server")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)