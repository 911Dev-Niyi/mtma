import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { weatherWorkflow, mtmaWorkflow } from './workflows';
import { weatherAgent, mtmaAgent } from './agents';

export const mastra = new Mastra({
  workflows: {
    weatherWorkflow,
    mtmaWorkflow,
  },
  agents: {
    weatherAgent,
    mtmaAgent,
  },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: {
    default: {
      enabled: true,
    },
  },
});
