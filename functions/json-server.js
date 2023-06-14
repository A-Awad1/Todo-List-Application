var data = {
  tasks: [
    {
      id: 1,
      content: "Complete online JavaScript course",
      completed: true,
      order: 1,
    },
    {
      id: 2,
      content: "Jog around the park 3x",
      completed: false,
      order: 2,
    },
    {
      id: 3,
      content: "10 minutes meditation",
      completed: false,
      order: 3,
    },
    {
      id: 4,
      content: "Read for 2 hours",
      completed: false,
      order: 4,
    },
    {
      id: 5,
      content: "Pick up groceries",
      completed: false,
      order: 5,
    },
    {
      id: 6,
      content: "Complete Todo App on Frontend Mentor",
      completed: false,
      order: 6,
    },
  ],
};

const jsonServer = require("json-server");
const serverless = require("serverless-http");

const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

exports.handler = serverless(server);
