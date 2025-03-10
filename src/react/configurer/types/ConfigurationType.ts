export type ConfigurationType = {
  project_name: string;
  promethues?: PrometheusConf; // Contains all Prometheus related configurations.
  print_configuration_onstartup?: boolean;
};

type PrometheusConf = {
  target_endpoint?: string;
};
