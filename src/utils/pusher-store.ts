import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import PusherServer from "pusher";
import PusherClient, { Channel, Members, PresenceChannel } from "pusher-js";
import { string } from "zod";
import { UserFull } from "../types/user";

type channelEvt =
  | "player-joined"
  | "player-left"
  | "rolled"
  | "pusher:subscription_succeeded"
  | "pusher:member_added"
  | "pusher:member_removed";

type roomID = string;

export const pusherServer = new PusherServer({
  appId: "1542974",
  key: "91fcd24238f218b740dc",
  secret: "6c9fc5e970ea66340bfa",
  cluster: "us2",
  useTLS: true,
});

export const pusherClient = new PusherClient("91fcd24238f218b740dc", {
  cluster: "us2",
  forceTLS: true,
});

export function privatePusherClient(userId: string, username: string) {
  return new PusherClient("91fcd24238f218b740dc", {
    cluster: "us2",
    forceTLS: true,
    channelAuthorization: {
      endpoint: "/api/pusher/channel-auth",
      transport: "ajax",
    },
    userAuthentication: {
      endpoint: "/api/pusher/user-auth",
      transport: "ajax",
      headers: { userid: userId, username: username },
    },
  });
}

export const useChannel = (
  channel: roomID
): {
  Subscription: Channel;
  BindEvent: <T = void>(
    event: channelEvt,
    callback: (data: T) => any
  ) => Channel;
  BindNRefetch: <T = void>(
    events: channelEvt[],
    refetchFnt: () => any
  ) => Channel[];
} => {
  const Subscription = pusherClient.subscribe(channel);

  function BindEvent<T = void>(
    event: channelEvt,
    callback: (data: T) => any
  ): Channel {
    return Subscription.bind(event, callback);
  }

  function BindNRefetch<T = void>(
    events: channelEvt[],
    refetchFnt: (data: T) => any
  ): Channel[] {
    return events.map((e) => Subscription.bind(e, refetchFnt));
  }

  return { Subscription, BindEvent, BindNRefetch };
};

export const usePresenceChannel = (
  privatePusherClient: PusherClient,
  channel: string
) => {
  const Subscription = privatePusherClient.subscribe(
    channel
  ) as PresenceChannel;

  function bindEvt<T = void>(event: channelEvt, callback: (data: T) => any) {
    return Subscription.bind(event, callback);
  }

  const disconnect = Subscription.disconnect;
  const Members = Subscription.members;
  return { Subscription, bindEvt, disconnect, Members };
};

export async function triggerEvent<D = void>(
  channel: string,
  event: channelEvt,
  data: D
): Promise<PusherServer.Response>;
export async function triggerEvent<D = void>(
  channel: string[],
  event: channelEvt,
  data: D
): Promise<PusherServer.Response>;
export async function triggerEvent<D = void>(
  channel: string | string[],
  event: channelEvt,
  data: D
): Promise<PusherServer.Response | Promise<PusherServer.Response>[]> {
  if (Array.isArray(channel)) {
    return channel.map((chan) => pusherServer.trigger(chan, event, data));
  }

  return pusherServer.trigger(channel, event, data);
}
