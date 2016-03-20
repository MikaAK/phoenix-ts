// Type definitions for Phoenix 1.0.0
// Project: http://phoenixframework.org/
// Definitions by: TADOKORO Saneyuki <https://github.com/Saneyan/>

declare module phoenix {

  const VSN: string;
  const SOCKET_STATES: {
    connecting: number;
    open: number;
    closing: number;
    closed: number;
  };
  const CHANNEL_STATES: {
    closed: string;
    errored: string;
    joined: string;
    joining: string;
  };
  const CHANNEL_EVENTS: {
    close: string;
    error: string;
    join: string;
    reply: string;
    leave: string;
  };
  const TRANSPORTS: {
    longpoll: string;
    websocket: string;
  };

  type PushPayload = {
    status?: string;
    response?: any;
    ref?: any;
  }

  class Push {
    channel: Channel;
    event: string;
    payload: PushPayload;
    receivedResp: PushPayload;
    afterHook: { ms: number, callback: Function, timer: number };
    recHooks: PushPayload;
    sent: boolean;
    refEvent: string; // con

    constructor(channel: Channel, event: string, payload?: PushPayload);
    send(): void;
    receive(status: string, callback: Function): Push;
    after(ms: number, callback: Function): Push;

    // private
    matchReceive({status, response, ref}: PushPayload): void;
    cancelRefEvent(): void;
    cancelAfter(): void;
    startAfter(): void;
  }

  class Channel {
    state: string;
    topic: string;
    params: any;
    bindings: { event: string, callback: Function }[];
    joinedOnce: boolean;
    joinPush: Push;
    pushBuffer: Push[];
    rejoinTimer: Timer;

    constructor(topic: string, params: any, socket: Socket);
    rejoinUntilConnected(): void;
    join(): Push;
    onClone(callback: Function): void;
    onError(): void;
    on(event: string, callback: Function): void;
    off(event: string): void;
    canPush(): boolean;
    push(event: string, payload: PushPayload): Push;
    leave(): Push;
    // Overridable message hook
    onMessage(event: string, payload: any, ref: any): void;

    // private
    isMember(topic: string): boolean;
    sendJoin(): void;
    rejoin(): void;
    trigger(triggerEvent: string, payload: any, ref: any): void;
    replyEventName(ref: any): string;
  }

  interface SocketOptions {
    params?: any;
    transport?: WebSocket;
    heartbeatIntervalMs?: number;
    reconnectAfterMs?: number;
    logger?: Function;
    longpollerTimeout?: number;
  }

  type StateChangeCallbacks = {
    open: Function[];
    close: Function[];
    error: Function[];
    message: Function[];
  }

  class Socket {
    stateChangeCallbacks: StateChangeCallbacks;
    channels: Channel[];
    sendBuffer: Function[];
    ref: number;
    transport: WebSocket;
    heartbeatIntervalMs: number;
    reconnectAfterMs: number;
    logger: Function;
    longpollerTimeout: number;
    params: any;
    reconnectTimer: Timer;
    endPoint: string;
    conn: WebSocket;

    constructor(endPoint: string, opts?: SocketOptions);
    protocol(): string;
    endPointURL(): string;
    disconnect(callback: Function, code: number, reason: any): void;
    connect(params?: any): void;
    log(kind: string, msg: string, data: any): void;
    onOpen(callback: Function): void;
    onClone(callback: Function): void;
    onError(callback: Function): void;
    onMessage(callback: Function): void;
    onConnOpen(): void;
    onConnClose(event: string): void;
    onConnError(error: any): void;
    triggerChanError(): void;
    connectionState(): string;
    isConnected(): boolean;
    remove(channel: Channel): void;
    channel(topic: string, chanParams?: any): Channel;
    push(data: any): void;
    makeRef(): string;
    sendHeartbeat(): void;
    flushSendBuffer(): void;
    onConnMessage(rawMessage: any): void;
  }

  class LongPoll {
    endPoint: string;
    token: string;
    skipHeartbeat: boolean;
    onopen: Function;
    onerror: Function;
    onmessage: Function;
    onclose: Function;
    pollEndpoint: string;
    readyState: string;

    constructor(endPoint: string);
    normalizeEndpoint(endPoint: string): string;
    endpointURL(): string;
    closeAndRetry(): void;
    ontimeout(): void;
    poll(): void;
    send(body: any): void;
    close(code: number, reason: any): void;
  }

  class Ajax {
    static request(
      method: string,
      endPoint: string,
      accept: string,
      body: any,
      timeout: number,
      ontimeout: Function,
      callback: Function
    ): void;

    static xdomainRequest(
      req: any,
      method: string,
      endPoint: string,
      body: any,
      timeout: number,
      ontimeout: Function,
      callback: Function
    ): void;

    static xhrRequest(
      req: (XMLHttpRequest | ActiveXObject),
      method: string,
      endPoint: string,
      accept: string,
      body: any,
      timeout: number,
      ontimeout: Function,
      callback: Function
    ): void;

    static parseJSON(resp: string): any;
    static serialize(obj: any, parentKey: string): string;
    static appendParams(url: string, params: any): string;
  }

  class Timer {
    callback: Function;
    timerCalc: Function;
    timer: number;
    tries: number;

    constructor(callback: Function, timerCalc: Function);
    reset(): void;
    setTimeout(): void;
  }
}
