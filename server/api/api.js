import { auth_router } from "./routes/authentication.js";
import config from "../utils/config.js";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import constructLog from "../utils/logger.js";

const log = constructLog("API Core");

const api = express();

// Middleware
api.use(express.json());
api.use(helmet());
api.use(cors({
  origin: config.server.allowed_origin,
  methods: ["GET", "POST"]
}));

// Routes
api.use('/api/v1/auth', auth_router);
// api.use('/api/v1/user', userRouter);
// api.use('/api/v1/artists', artistRouter);
// api.use('/api/v1/venues', venueRoutes);
// api.use('/api/v1/events', eventRoutes);

// Create Server
api.listen(config.server.port, () => {
  log.info("API listening on port "+config.server.port)
});