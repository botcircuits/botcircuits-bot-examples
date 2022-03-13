beforeEach(() => {
    jest.resetModules();
    process.env = {

    };
    jest.setTimeout(30000);
});

test('success get', async () => {
    const indexF = require("../index");
    const event = {
        appId: 'app1',
        version: 'v1',
        sessionId: 's1',
        sessionContext: {
            intent: 'send-request',
            entities: { url: ['https://jsonplaceholder.typicode.com/todos'], method: ['get'] },
            sessionAttributes: {}
        }
    };
    const response = await indexF.handler(event, {});
    console.log(response)
    expect(response.type).toEqual('CUSTOM');
});

test('success post', async () => {
    const indexF = require("../index");
    const event = {
        appId: 'app1',
        version: 'v1',
        sessionId: 's1',
        channel: 'slack',
        sessionContext: {
            intent: 'send-request',
            entities: {
                url: ['https://jsonplaceholder.typicode.com/todos'],
                method: ['post'],
                requestBody: [JSON.stringify({id: 1001})]
            },
            sessionAttributes: {}
        }
    };
    const response = await indexF.handler(event, {});
    console.log(response)
    expect(response.type).toEqual('CUSTOM');
});

test('fail get', async () => {
    const indexF = require("../index");
    const event = {
        appId: 'app1',
        version: 'v1',
        sessionId: 's1',
        sessionContext: {
            intent: 'send-request',
            entities: {
                url: ['https://cccccxxxjsonplaceholder.typicode.com/todos'],
                method: ['post'],
                requestBody: [JSON.stringify({id: 1001})]
            },
            sessionAttributes: {}
        }
    };
    const response = await indexF.handler(event, {});
    console.log(response)
    expect(response.type).toEqual('CUSTOM');
});
