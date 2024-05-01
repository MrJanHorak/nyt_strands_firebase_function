FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Install Puppeteer
RUN npm install puppeteer

# Install Chromium
RUN apt-get update && apt-get install -y chromium

# Configure Puppeteer to use the correct path to the Chrome browser
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

COPY . .

CMD ["node", "index.js"]