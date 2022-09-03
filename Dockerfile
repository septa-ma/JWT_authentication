FROM node:12-alpine3.14
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app/
RUN npm install -g npm@8.19.1
RUN npm cache clean --force
RUN npm install --quiet
COPY . /app
EXPOSE 3030
CMD ["npm", "run", "dev"]