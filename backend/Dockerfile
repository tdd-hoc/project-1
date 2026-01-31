# Stage 1: Base Image
FROM python:3.12-slim

# Env Vars for Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Stage 2: Install System Dependencies (Cached Layer)
# We move this UP because these rarely change. 
# Installing them before copying code speeds up re-builds.
RUN apt-get update && apt-get install -y \
    gcc \
    pkg-config \
    libmariadb-dev \
    && rm -rf /var/lib/apt/lists/*

# Stage 3: Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Stage 4: Install Python Dependencies
# Copy ONLY the lock files first (Docker Cache magic)
COPY pyproject.toml uv.lock ./

# Install dependencies into a virtual environment
# --frozen: Ensures we use exact versions from uv.lock
# --no-dev: Skips testing tools
RUN uv sync --frozen --no-dev

# Thêm dòng này để Docker biết đường tìm uvicorn trong .venv
ENV PATH="/app/.venv/bin:$PATH"

# Stage 5: Copy Your Application Code
COPY . .

# Stage 6: Run
# Add the virtual environment to PATH so we can run commands directly
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]  