FROM node:18.13.0

WORKDIR /usr/business-investor/client

COPY package.json /usr/business-investor/client
RUN npm i

COPY . .

EXPOSE 3010
CMD ["npm", "run", "dev"]
