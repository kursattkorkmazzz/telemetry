import React, { useReducer } from "react";
import { createContext, ReactNode, useContext } from "react";
import LabelType from "../types/LabelType";
import MetricDataArray from "../types/MetricDataArrayType";
import PublisherListReducer from "../reducers/publisher-list-reducer";
import { AbstractPublisher } from "src/core";

// #region Context Creation
type TelemetryContextOptions = {
  publish: (data: MetricDataArray, publisher_id?: string | null) => void;
  getPublisherIdList: () => string[];
  registerPublisher: (
    publisher: AbstractPublisher,
    publisher_id: string
  ) => void;
  unregisterPublisher: (publisher_id: string) => boolean;
  project_name: string; // Get by user.
  common_labels?: LabelType; // Get by user.
};

const TelemetryContext = createContext<TelemetryContextOptions | null>(null);

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (!context)
    throw new Error(
      "You can use this function only in TelemetryProvider and its children components."
    );
  return context;
}

// #endregion

type TelemetryProviderProps = {
  project_name: string; // Get by user.
  common_labels?: LabelType; // Get by user.
  children?: ReactNode;
};

export function TelemetryProvider(props: TelemetryProviderProps) {
  const [state, dispatch] = useReducer(PublisherListReducer, []);

  const registerHandler = (
    publisher: AbstractPublisher,
    publisher_id: string
  ) => {
    dispatch({
      action: "register",
      data: {
        id: publisher_id,
        publisher: publisher,
      },
    });
  };
  const unregisterHandler = (publisher_id: string): boolean => {
    dispatch({
      action: "unregister",
      data: {
        id: publisher_id,
      },
    });
    return false;
  };
  const publishHandler = (
    data: MetricDataArray,
    publisher_id?: string | null
  ) => {
    // Adding all labels into data.
    data.forEach((metric) => {
      metric.labels = {
        ...metric.labels,
        project_name: props.project_name,
        ...props.common_labels,
      };
    });

    if (publisher_id) {
      dispatch({
        action: "publishById",
        data: {
          publisher_id: publisher_id,
          metrics: data,
        },
      });
    } else {
      dispatch({
        action: "publishAll",
        data: {
          metrics: data,
        },
      });
    }
  };
  const getPublisherIdHandler = () => {
    return state.map((p) => p.id);
  };

  return (
    <TelemetryContext.Provider
      value={{
        project_name: props.project_name,
        common_labels: props.common_labels,
        publish: publishHandler,
        getPublisherIdList: getPublisherIdHandler,
        registerPublisher: registerHandler,
        unregisterPublisher: unregisterHandler,
      }}
    >
      {props.children}
    </TelemetryContext.Provider>
  );
}
