const getEntityValue = (entities, entityKey) => {
    const entityValues = entities[entityKey];
    return (entityValues && entityValues.length) > 0 ? entityValues[0] : null;
}

exports.handler = async (event, context) => {
    console.log("event", JSON.stringify(event));
    const entities = event.sessionContext.entities;
    const method = getEntityValue(entities, 'method');
    const requestBody = getEntityValue(entities, 'requestBody');
    if (!requestBody && ( method === 'post' || method === 'put')) {
        // if method is POST or PUT, requestBody is required. ask user to input
        return {
            type: 'ENTITY_UPDATE',
            entityToFill: 'requestBody',
            message: {
                type: 'PLAIN_TEXT',
                content: 'What is the request body?'
            }
        }
    }

    // continue to fullfillment
    return {
        type: 'PROCEED',
    }
};