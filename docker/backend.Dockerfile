FROM node:18
WORKDIR /app
COPY backend /app
RUN npm install
CMD ["npm", "start"]
