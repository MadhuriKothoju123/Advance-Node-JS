FROM node:20
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
# ARG NODE_ENV
# ENV NODE_ENV=${NODE_ENV}
# Build TypeScript code (only for non-development environments)
# RUN if [ "$NODE_ENV" != "development" ]; then npm run build; fi
RUN npm run build
# EXPOSE 5001
# CMD ["node", "dist/server.js"]
# Use different commands based on environment
# CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm run start; else npm run dev; fi"]
RUN npm run build

CMD ["node", "dist/index.js"]
