FROM python:3.10

# Set up a new user named "user" with user ID 1000
RUN useradd -m -u 1000 user

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything else into the container
COPY --chown=user . /app

# Switch to the "user" user
USER user

# Hugging Face Spaces expose port 7860
EXPOSE 7860

CMD ["python", "app.py"]