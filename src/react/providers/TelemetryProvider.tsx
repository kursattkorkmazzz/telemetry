import React, { useEffect, useReducer } from "react";
import { createContext, ReactNode, useContext } from "react";
import PublisherListReducer from "../reducers/publisher-list-reducer";
import { AbstractPublisher } from "src/core";
import MetricData, { TagType } from "src/core/types/MetricData";
import { sendSavedDataToPublisher } from "../utils/browser-close-handler";

// #region Context Creation
type TelemetryContextOptions = {
  publish: (data: MetricData[], publisher_id?: string | null) => void;
  getPublisherIdList: () => string[];
  registerPublisher: (
    publisher: AbstractPublisher,
    publisher_id: string
  ) => void;
  unregisterPublisher: (publisher_id: string) => boolean;
  common_tags?: TagType; // Get by user.
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
  common_tags?: TagType; // Get by user.
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
  const publishHandler = (data: MetricData[], publisher_id?: string | null) => {
    // Adding all common tags into data.
    data.forEach((metric) => {
      metric.tags = {
        ...metric.tags,
        ...props.common_tags,
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

  useEffect(() => {
    sendSavedDataToPublisher(publishHandler);
  }, []);

  return (
    <TelemetryContext.Provider
      value={{
        common_tags: props.common_tags,
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
