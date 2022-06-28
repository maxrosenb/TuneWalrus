FROM node:18

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
RUN npm install ts-node -g

FROM nikolaik/python-nodejs:python3.5-nodejs8

RUN apt-get update
apt-get -y install redis-server

COPY . /app
WORKDIR /app
CMD redis-server
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /usr/src/app


CMD [ "npm", "start" ]
