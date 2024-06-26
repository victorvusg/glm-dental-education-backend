import { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import Scenario from '../models/scenario';
import { ERROR_RESPONSE } from '../constants';

export const scenarioCreate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    patientName,
    age,
    symptoms,
    lifeStyle,
    additionalInformation,
    createdUserId,
    name,
    gender,
    medicalHistory,
    communicationStyle,
  } = req.body;

  try {
    const scenario = new Scenario({
      name,
      patientName,
      age,
      gender,
      medicalHistory,
      symptoms,
      lifeStyle,
      additionalInformation,
      communicationStyle,
      createdUserId,
    });

    const savedScenario = await scenario.save();
    res.status(201).json(savedScenario);
  } catch (err) {
    const error = err as MongoServerError;
    res.status(400).json({ error: error.errmsg });
  }
};

export const scenarioGetList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const scenarios = await Scenario.find().sort({ updatedAt: 'desc' });
    res.status(200).json({ scenarios });
  } catch (err) {
    const error = err as MongoServerError;
    res.status(400).json({ error: error.errmsg });
  }
};

export const scenarioGetDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  if (!id) res.status(400).json(ERROR_RESPONSE.RECORD_NOT_FOUND);

  try {
    const scenario = await Scenario.findById(id);
    res.status(200).json(scenario);
  } catch (err) {
    const error = err as MongoServerError;

    res.status(400).json({ error: error.errmsg });
  }
};
