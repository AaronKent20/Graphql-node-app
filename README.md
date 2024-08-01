# Graphql-node-app

## Overview

Simple list reordering app using React Frontend with Material UI components and a GraphQL + Node backend using sequelize as an ORM

## Setup Instructions

To run locally use docker compose up to run the required containers and access the UI at localhost:3000 If not using Docker, use npm start in frontend/app and backend/app and update the env vars to point to your Postgres instance

## Available Scripts

- Docker compose up to run the app

## Assumptions / Design Decisions

- I Did a refetch once updated goes through in anticipation of pagination / infinite scroll, depending on the size of the list / data, a frontend local copy of the reordered list could be saved and then sent as an array of records to update
