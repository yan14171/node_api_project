const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/NodeProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const carSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  engine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Engine',
  },
});

const engineSchema = new mongoose.Schema({
  type: String,
  horsepower: Number,
});

const Car = mongoose.model('Car', carSchema);
const Engine = mongoose.model('Engine', engineSchema);

app.get('/cars', async (req, res) => {
  const cars = await Car.find().populate('engine');
  res.json(cars);
});

app.get('/cars/:id', async (req, res) => {
  const car = await Car.findById(req.params.id).populate('engine');
  res.json(car);
});

app.post('/cars', async (req, res) => {
  const car = new Car(req.body);
  await car.save();
  res.json(car);
});

app.put('/cars/:id', async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate('engine');
  res.json(car);
});

app.delete('/cars/:id', async (req, res) => {
  const car = await Car.findByIdAndDelete(req.params.id).populate('engine');
  res.json(car);
});

// define routes for CRUD operations on engines
app.get('/engines', async (req, res) => {
  const engines = await Engine.find();
  res.json(engines);
});

app.get('/engines/:id', async (req, res) => {
  const engine = await Engine.findById(req.params.id);
  res.json(engine);
});

app.post('/engines', async (req, res) => {
  const engine = new Engine(req.body);
  await engine.save();
  res.json(engine);
});

app.put('/engines/:id', async (req, res) => {
  const engine = await Engine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(engine);
});

app.delete('/engines/:id', async (req, res) => {
  const engine = await Engine.findByIdAndDelete(req.params.id);
  res.json(engine);
});

app.listen(PORT, () => {
  console.log('Server listening on port 3000');
});
