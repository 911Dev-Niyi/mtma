import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { weatherWorkflow, mtmaWorkflow } from './workflows';
import { weatherAgent, mtmaAgent } from './agents';
import { a2aAgentRoute } from './routes/a2a-agent-route';

export const mastra = new Mastra({
  workflows: {
    weatherWorkflow,
    mtmaWorkflow,
  },
  agents: {
    weatherAgent,
    mtmaAgent,
  },
  server: { apiRoutes: [a2aAgentRoute]},
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: {
    default: {
      enabled: true,
    },
  },
  telemetry: {
    enabled: false,
  }
});
