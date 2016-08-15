FROM mhart/alpine-node:4

WORKDIR /src
ADD . .

EXPOSE 3000

RUN apk add --no-cache git
RUN npm install
CMD ["node", "index.js"]
