import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { mtmaWorkflow } from './workflows';
import { mtmaAgent } from './agents';
import { a2aAgentRoute } from './routes/a2a-agent-route';

export const mastra = new Mastra({
  workflows: {
    mtmaWorkflow,
  },
  agents: {
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
