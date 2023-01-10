import { trace } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import {
  CollectorExporterNodeConfigBase,
  CollectorTraceExporter,
} from "@opentelemetry/exporter-collector";

// type Config = {
//   telemetryEndpoint?: string,
//   telemetrySecret?: string,
// };

const provider = new WebTracerProvider({
  resource: new Resource({ "service.name": "flubber" }),
});

trace.setGlobalTracerProvider(provider);

const instrumentations =
  typeof fetch === "undefined"
    ? []
    : [
        new FetchInstrumentation({
          ignoreUrls: [/^https:\/\/api\.segment\.io/],
        }),
      ];

registerInstrumentations({
  instrumentations,
});

const name = "flubber-instrumentation";
const version = "0.1.0";

// export async function initInstrumentation() {
//   // Uncomment this if you want to see span output in your dev console:
//   //provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

//   try {
//     const config: Config = await fetch("/config.json").then((response) => {
//       if (response.ok) {
//         return response.json();
//       } else {
//         throw new Error(`Could not fetch config.json (${response.status})`);
//       }
//     });

//     const { telemetryEndpoint, telemetrySecret } = config;
//     if (telemetryEndpoint && telemetrySecret) {
//       const exporterConfig: CollectorExporterNodeConfigBase = {
//         url: telemetryEndpoint,
//         headers: { authorization: `Bearer ${telemetrySecret}` },
//       };
//       const exporter = new CollectorTraceExporter(exporterConfig);
//       provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
//     }
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.warn("Cannot initialize instrumentation: " + error);
//   }
// }

export const tracer = trace.getTracer(name, version);
