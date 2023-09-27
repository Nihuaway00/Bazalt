FROM node:16.17.0
WORKDIR .
COPY . .
RUN npm install --production
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

