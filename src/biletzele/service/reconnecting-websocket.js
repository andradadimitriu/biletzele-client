import config from '../../config';

const CONNECTION_DELAY = 3000;
class WebSocketClient {
    static instance = null;

    static getInstance() {
        if (!WebSocketClient.instance) WebSocketClient.instance = new ReconnectingSocket(config.websocketHostname);
        return WebSocketClient.instance;
    }
}

function ReconnectingSocket(url) {
    let client;
    let isConnected = false;
    let reconnectOnClose = true;
    let messageListeners = [];
    let stateChangeListeners = [];

    function on(fn) {
        messageListeners.push(fn);
    }

    function off(fn) {
        messageListeners = messageListeners.filter(l => l.originalName !== fn.originalName);
    }

    function onStateChange(fn) {
        stateChangeListeners.push(fn);
        return () => {
            stateChangeListeners = stateChangeListeners.filter(l => l !== fn);
        };
    }

    function sendWithReconnect(params){
        if(isConnected) {
           return client.send(params);
        }
        //TODO not sure this is needed given or if you are not getting into more issues
        setTimeout(conditionalStart, CONNECTION_DELAY);
        sendWithReconnect(params);
    }

    function conditionalStart(){
        if(!isConnected){
            start();
        }
    }

    function start() {
        client = new WebSocket(url);

        client.onopen = () => {
            isConnected = true;
            stateChangeListeners.forEach(fn => fn(true));
        }

        const close = client.close;

        // Close without reconnecting;
        client.close = () => {
            reconnectOnClose = false;
            close.call(client);
        }

        client.onmessage = (event) => {
            messageListeners.forEach(fn => fn(event.data));
        }

        client.onerror = (e) => console.error(e);

        client.onclose = () => {

            isConnected = false;
            stateChangeListeners.forEach(fn => fn(false));

            if (!reconnectOnClose) {
                console.log('ws closed by app');
                return;
            }

            console.log('ws closed by server');

            setTimeout(conditionalStart, CONNECTION_DELAY);
        }
    }

    start();

    return {
        on,
        off,
        onStateChange,
        close: () => client.close(),
        getClient: () => client,
        isConnected: () => isConnected,
        send: (param) => sendWithReconnect(param)
    };
}

export default WebSocketClient.getInstance();