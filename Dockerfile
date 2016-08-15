FROM mhart/alpine-node:4

WORKDIR /src
ADD . .

EXPOSE 3000

RUN npm install
CMD ["node", "index.js"]
