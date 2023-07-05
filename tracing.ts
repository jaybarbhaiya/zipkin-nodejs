import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import opentelemetry from "@opentelemetry/api";

// Optionally register instrumentation libraries
registerInstrumentations({
    // Provides intrumentation for HTTP and Express.
    // Express requires HTTP instrumentation to be enabled.
    instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation()
    ],
});

const resource =
    Resource.default().merge(
        new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: "sample-app",
            [SemanticResourceAttributes.SERVICE_VERSION]: "0.1.0",
        })
    );

const provider = new NodeTracerProvider({
    resource: resource,
});
const exporter = new ConsoleSpanExporter();
const processor = new BatchSpanProcessor(exporter);
provider.addSpanProcessor(processor);

provider.register();

const zipkinExporter = new ZipkinExporter({
    serviceName: "getting-started"
});
const simpleProcessor = new SimpleSpanProcessor(zipkinExporter);
provider.addSpanProcessor(simpleProcessor);


// const tracer = opentelemetry.trace.getTracer(
//     'my-service-tracer'
// );

// // Create a span. A span must be closed.
// tracer.startActiveSpan('main', (span) => {
//     for (let i = 0; i < 10; i += 1) {
//         console.log(i);
//     }

//     // Be sure to end the span!
//     span.end();
// });