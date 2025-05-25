FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copia todo el backend
COPY . .

# Copia la carpeta de build del frontend (asumiendo que ya corriste npm run build afuera)
# COPY frontend/dist ./frontend/dist

EXPOSE 3000
CMD ["node", "app.js"]
