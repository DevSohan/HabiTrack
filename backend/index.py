from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

app = FastAPI()
# Allow frontend origin
origins = [
    "http://localhost:3000",  # Next.js dev server
    "https://localhost:3000",  # in case you're using HTTPS locally
    "http://backend:3000",  # Next.js dev server
    "https://backend:3000",  # in case you're using HTTPS locally
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or use ['*'] for all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)