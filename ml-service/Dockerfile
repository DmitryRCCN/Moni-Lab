# 1. Imagen base ligera de Python
FROM python:3.11-slim

# 2. Instalación de dependencias del sistema necesarias para compilar 
# algunas librerías de Python y manejar fuentes para el PDF
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# 3. Directorio de trabajo
WORKDIR /app

# 4. Optimización de cache: Copiamos primero solo los requerimientos
# Esto evita reinstalar todo si solo se cambia una línea de código
COPY requirements.txt .

# 5. Instalación de librerías de Python
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 6. Copiamos el resto del código del servicio
COPY . .

# 7. Exponemos el puerto (variable $PORT)
# Usamos un shell script para que el puerto sea dinámico
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]