FROM node:16

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
RUN npm i ffmpeg-static

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /usr/src/app


CMD [ "npx", "ts-node", "--transpile-only", "src/server.ts" ]
