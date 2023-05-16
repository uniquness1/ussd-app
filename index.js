const express = require("express");
const app = express();
const ussdMenu = require("ussd-builder");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const credentials = {
  apikeys: 'sandbox',
  username: 'c9abd16ada32e2174d52c0d48879c1a05c0c3d0bdae2aed287327228979e5ad5'
};
const AfricasTalking = require('africastalking')(credentials);
const menu = new ussdMenu();
let dataToSave = [];

menu.startState({
  run: () => {
    menu.con("Welcome Here \n 1. sign in \n 2. quit");
  },
  next: {
    "1": "register",
    "2": "quit"
  }
});

menu.state("register", {
  run: () => {
    menu.con("What is your name?");
  },
  next: {
    "": "register.tickets"
  }
});

menu.state("register.tickets", {
  run: () => {
    let name = menu.val;
    dataToSave.name = name;
    menu.con("$[name], How many tickets do you want");
  },
  next: {
    "": "end"
  }
});

menu.state("end", {
  run: () => {
    let tickets = menu.val;
    dataToSave.tickets = tickets;
    menu.end('Thanks for registering, we are sending your tickets confirmation soon');
  }
});

menu.state('quit', {
  run: () => {
    menu.end('Please check again later');
  }
});

app.post("/ussd", (req, res) => {
  menu.run(req.body, ussdResult => {
    res.send(ussdResult);
  });
});

const port = 3000; // Specify the port number
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
