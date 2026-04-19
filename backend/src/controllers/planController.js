const SubscriptionPlan = require('../models/SubscriptionPlan');

const getPlans = async (req, res) => {
  const plans = await SubscriptionPlan.find({}).sort({ price: 1 });
  res.json(plans);
};

const createPlan = async (req, res) => {
  const { name, speed, price, features, isPopular } = req.body;
  const plan = await SubscriptionPlan.create({ name, speed, price, features, isPopular });
  res.status(201).json(plan);
};

const updatePlan = async (req, res) => {
  const { id } = req.params;
  const { name, speed, price, features, isPopular } = req.body;

  const plan = await SubscriptionPlan.findById(id);
  if (plan) {
    plan.name = name;
    plan.speed = speed;
    plan.price = price;
    plan.features = features;
    plan.isPopular = isPopular;
    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } else {
    res.status(404).json({ message: 'Plan not found' });
  }
};

const deletePlan = async (req, res) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findById(id);
  if (plan) {
    await plan.deleteOne();
    res.json({ message: 'Plan removed' });
  } else {
    res.status(404).json({ message: 'Plan not found' });
  }
};

module.exports = { getPlans, createPlan, updatePlan, deletePlan };
