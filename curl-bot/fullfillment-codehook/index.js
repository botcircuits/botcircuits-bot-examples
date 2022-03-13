const {get, post, put, del} = require('./http-client');

const getEntityValue = (entities, entityKey) => {
    const entityValues = entities[entityKey];
    return (entityValues && entityValues.length) > 0 ? entityValues[0] : null;
}

const createHttpResponse = ({data, status, statusText}) => {
    return {data, status, statusText};
}

const createResponseByChannel = (url, method, requestBody, response, channel) => {
    if (channel === 'slack') {
        let responseStr = JSON.stringify(response.data);
        if (responseStr.length > 1800) {
            responseStr = "Unable to display response. Exceed max character length ( 1800 )";
        }
        return {
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Here is your result"
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": `*URL:*\n${url}`
                        },
                        {
                            "type": "mrkdwn",
                            "text": `*Method:*\n${method.toUpperCase()}`
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*Request Body:*\n`" + JSON.stringify(requestBody) + "`"
                        },
                        {
                            "type": "mrkdwn",
                            "text": `*Status:*\n${response.status} ${(response.status >= 200 && response.status < 300?":white_check_mark:":":x:")}`
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*Response:*\n`" + responseStr + "`"
                        }
                    ]
                }
            ]
        }
    } else {
        return response;
    }
}

const createTextResponse = content => {
    return {
        type: 'TEXT',
        content
    }
}

exports.handler = async (event, context) => {
    console.log("event", JSON.stringify(event));
    try {
        const entities = event.sessionContext.entities;
        const url = getEntityValue(entities, 'url');
        const method = getEntityValue(entities, 'method').toLowerCase();

        let response;
        let requestBody = {};
        if (method === 'post') {
            requestBody = getEntityValue(entities, 'requestBody');
            const httpResp = await post(url, requestBody);
            response = createHttpResponse(httpResp);
        } else if (method === 'put') {
            requestBody = getEntityValue(entities, 'requestBody');
            response = createHttpResponse(await put(url, requestBody));
        } else if (method === 'get') {
            response = createHttpResponse(await get(url));
        } else if (method === 'delete') {
            response = createHttpResponse(await get(url));
        } else {
            response = createHttpResponse(
                {data: 'invalid http method', status: 400, statusText: 'bad request'});
        }

        return {
            type: 'CUSTOM',
            content: createResponseByChannel(url, method, requestBody, response, event.channel)
        }
    } catch (err) {
        console.error("execution failed cause", err);
        if (err.message.includes('Network Error') || err.code === 'ENOTFOUND') {
            return createTextResponse(`Network Error. Unable to reach ${err.config.url}`);
        } else {
            return createTextResponse('Internal error occurred');
        }
    }
};