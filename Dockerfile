FROM node

WORKDIR /vehicles_commerce_api

COPY package.json /vehicles_commerce_api

RUN yarn

COPY . /vehicles_commerce_api