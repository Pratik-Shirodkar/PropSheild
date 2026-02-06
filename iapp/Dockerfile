FROM python:3.9-alpine

WORKDIR /app

COPY iapp/src/app.py /app/app.py

# No extra requirements for now, but if needed:
# COPY requirements.txt .
# RUN pip install -r requirements.txt

ENTRYPOINT ["python", "/app/app.py"]
