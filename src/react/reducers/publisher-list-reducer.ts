import { AbstractPublisher } from "src/core";
import MetricData from "src/core/types/MetricData";

type PublisherListItemType = { id: string; publisher: AbstractPublisher };

type PublisherListReducerActionType = {
  action: "register" | "unregister" | "publishAll" | "publishById";
  data: RegisterProps | DeRegisterProps | PublishAllProps | PublishByIdProps;
};

export default function PublisherListReducer(
  state: PublisherListItemType[],
  action: PublisherListReducerActionType
): PublisherListItemType[] {
  switch (action.action) {
    case "register":
      return register(state, action.data as RegisterProps);
    case "unregister":
      return deregister(state, action.data as DeRegisterProps);
    case "publishAll":
      return publishAll(state, action.data as PublishAllProps);
    case "publishById":
      return publishById(state, action.data as PublishByIdProps);
    default:
      return state;
  }
}

// #region Operation Functions

type RegisterProps = PublisherListItemType;
function register(
  prevState: PublisherListItemType[],
  data: RegisterProps
): PublisherListItemType[] {
  // Check id is exist in data.
  if (data.id.length <= 0) {
    return prevState;
  }
  // Check id is already exist in list if not add publisher.
  const foundPublisher = prevState.find((p) => p.id === data.id);
  if (foundPublisher) return prevState;
  return [...prevState, data];
}

// De register Function
type DeRegisterProps = { id: string };
function deregister(
  prevState: PublisherListItemType[],
  data: DeRegisterProps
): PublisherListItemType[] {
  const foundPublisher = prevState.find((p) => p.id === data.id);

  if (!foundPublisher) return prevState;

  return prevState.filter((p) => p.id !== data.id);
}

type PublishAllProps = { metrics: MetricData[] };
function publishAll(
  prevState: PublisherListItemType[],
  data: PublishAllProps
): PublisherListItemType[] {
  prevState.forEach((p) => {
    p.publisher.publish(...data.metrics);
  });
  return prevState;
}

type PublishByIdProps = { publisher_id: string; metrics: MetricData[] };
function publishById(
  prevState: PublisherListItemType[],
  data: PublishByIdProps
): PublisherListItemType[] {
  const publisher = prevState.find((p) => p.id === data.publisher_id);

  if (publisher) {
    publisher.publisher.publish(...data.metrics);
  }
  return prevState;
}

// #endregion
