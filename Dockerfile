FROM node:16

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


FROM nikolaik/python-nodejs:python3.5-nodejs8

RUN npm install
RUN npm install ts-node -g

RUN wget -qO - https://raw.githubusercontent.com/yarnpkg/releases/gh-pages/debian/pubkey.gpg | apt-key add -
RUN apt-get update
RUN apt-get install -y redis

COPY . /app
WORKDIR /app

RUN redis-server --daemonize yes
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /usr/src/app


CMD [ "npm", "start" ]
