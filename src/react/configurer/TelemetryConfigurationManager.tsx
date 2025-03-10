import React, { useEffect, useState } from "react";
import { createContext, ReactNode, useContext } from "react";
import { ConfigurationType } from "./types/ConfigurationType";
import { configurationDefaults } from "./ConfigurationDefault";

const TelemetryConfigurationManagerContext = createContext<ConfigurationType>(
  configurationDefaults
);

export function useTelemetryConfiguration() {
  const context = useContext(TelemetryConfigurationManagerContext);
  if (!context) {
    throw new Error(
      "useTelemetryConfiguration must be called in TelemetryConfigurationManager component."
    );
  }
  return context;
}

export function TelemetryConfigurationManager(props: {
  configuration: ConfigurationType;

  children?: ReactNode;
}) {
  const [configuration, _] = useState<ConfigurationType>({
    ...configurationDefaults,
    ...props.configuration,
  });

  useEffect(() => {
    if (configuration.print_configuration_onstartup) {
      console.log("Configuration: \n", JSON.stringify(configuration, null, 2));
    }
  }, [configuration]);

  return (
    <TelemetryConfigurationManagerContext.Provider value={configuration}>
      {props.children}
    </TelemetryConfigurationManagerContext.Provider>
  );
}
