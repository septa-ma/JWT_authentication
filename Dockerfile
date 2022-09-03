FROM node:12.22.9
RUN mkdir -p /app
WORKDIR /app
RUN install npm
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3030
CMD ["npm", "run", "dev"]