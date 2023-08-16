import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const { endpoint, port } = PrometheusExporter.DEFAULT_OPTIONS;

const exporter = new PrometheusExporter({}, () => {
    console.log(
        `prometheus scrape endpoint: ${port}${endpoint}`,
    );
});

// Creates MeterProvider and installs the exporter as a MetricReader
const meterProvider = new MeterProvider();
meterProvider.addMetricReader(exporter);
const meter = meterProvider.getMeter('example-prometheus');

// Creates metric instruments
const requestCounter = meter.createCounter('requests', {
    description: 'Example of a Counter'
});

const upDownCounter = meter.createUpDownCounter('test_up_down_counter', {
    description: 'Example of a UpDownCounter',
});

const attributes = { pid: process.pid, environment: 'staging' };

let counter = 0;
const observableCounter = meter.createObservableCounter('observable_requests', {
    description: 'Example of an ObservableCounter'
});
observableCounter.addCallback(observableResult => {
    observableResult.observe(counter, attributes);
});

// Record metrics
setInterval(() => {
    counter++;
    requestCounter.add(1, attributes);
    upDownCounter.add(Math.random() > 0.5 ? 1 : -1, attributes);
}, 1000);