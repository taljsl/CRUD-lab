// | HTTP Method (Verb) | Path/Endpoint/URI     | Route Name | Has Data Payload? | Purpose                                                                                            | Render/Redirect Action                                   |
// | ------------------ | --------------------- | ---------- | ----------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
// | GET                | `/`                   | index      | No                | Display the homepage                                                                               | `res.render('index.ejs')                                 |
// | GET                | `/cards`              | cardsIndex | No                | Renders a view that shows all Card names                                                           | `res.render('/cards/index.ejs', {cards: allCards})`                |
// | GET                | `/cards/:cardId`      | cardsShow  | No                | Renders a view that shows a specific card                                                          | `res.render('/cards/show.ejs', {card: specificCard})`    |
// | GET                | `/cards/new`          | newCard    | No                | Renders a view including a form the user can fill out and submit to add a new card                 | `res.render('cards/new.ejs')`                            |
// | GET                | `/cards/:cardId/edit` | cardEdit   | No                | Show form to edit a specified card                                                                 | `res.render('/cards/edit.ejs', {card: specificCard})`    |
// | POST               | `/cards`              | cardCreate | Yes(formdata)     | Add a new card to the database                                                                     | `res.redirect('/cards/new')`                             |
// | PUT                | `/cards/:cardId`      | updateCard | Yes(formdata)     | Update a specific Card                                                                             | `res.redirect('/cards/:cardId')`                         |
// | DELETE             | `/cards/:cardId`      | deleteCard | No                | Delete a card from the database                                                                    | `res.redirect('/cards')`                                 |

// base template above stolen from restful routing lesson

// express variables
const express = require("express");
const app = express();
// dontenv setup
const dotenv = require("dotenv");
dotenv.config();
// mongoose setup
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () =>
  console.log(`Connected to MongoDB ${mongoose.connection.name}`)
);
// Port variable for quick access
const PORT = 3001;
// morgan and method Override
const morgan = require("morgan");
const methodOverride = require("method-override");
// schema import
const Card = require("./models/cards");
//All app.use's below
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

// middleware for static files
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// all gets below

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

// page displaying all cards
app.get("/cards", async (req, res) => {
  const allCards = await Card.find();
  console.log(allCards);
  // send each cards object to the rendered page
  res.render("cards/index.ejs", { cards: allCards });
});
// This has to be above the below or it breaks
app.get("/cards/new", async (req, res) => {
  res.render("cards/new.ejs");
});

// post request below
app.post("/cards", async (req, res) => {
  console.log(req.body);
  if (req.body.isCommanderLegal === "on") {
    req.body.isCommanderLegal = true;
  } else {
    req.body.isCommanderLegal = false;
  }
  await Card.create(req.body);
  res.redirect("/cards/new");
});

// delte request
app.delete("/cards/:cardId", async (req, res) => {
  console.log(req.params.cardId);
  console.log(await Card.findById(req.params.cardId));
  await Card.findByIdAndDelete(req.params.cardId);
  res.redirect("/cards");
});

// specific card pages - this has to be below any other /cards/specifictext
app.get("/cards/:cardId", async (req, res) => {
  const specificCard = await Card.findById(req.params.cardId);
  // send the specific card info to the page
  res.render("cards/show.ejs", { card: specificCard });
});

app.get("/cards/:cardId/edit", async (req, res) => {
  const specificCard = await Card.findById(req.params.cardId);
  res.render("cards/edit.ejs", { card: specificCard });
});

app.put("/cards/:cardId", async (req, res) => {
  if (req.body.isCommanderLegal === "on") {
    req.body.isCommanderLegal = true;
  } else {
    req.body.isCommanderLegal = false;
  }
  await Card.findByIdAndUpdate(req.params.cardId, req.body);
  res.redirect(`/cards/${req.params.cardId}`);
});

// Nothing goes below this
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
