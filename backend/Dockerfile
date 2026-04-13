FROM python:3.14-slim

WORKDIR /app

RUN pip install uv

COPY pyproject.toml ./
RUN uv sync --frozen

COPY . .

EXPOSE 7077

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7077"]