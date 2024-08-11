#!/bin/bash

# Construir la imagen Docker
docker build -t colombian_api_omarvargas .

# Ejecutar el contenedor
docker run -p 3000:3000 colombian_api_omarvargas
