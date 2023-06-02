FROM node:18.13.0

WORKDIR /usr/business-investor/api

COPY package.json /usr/business-investor/api

# generated prisma files
COPY prisma /usr/business-investor/api/prisma

RUN npm i
RUN npx prisma generate

COPY . .

RUN ls

EXPOSE 3000
#RUN npm run migrate:prod
#RUN npm run seed
CMD ["npm", "run", "start:dev"]
