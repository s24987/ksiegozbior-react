const parseErrors = (errors) => {
    for (const error of errors) {
        console.log(error);
    }
    // todo
    return 'Error';
};

const combineMessages = (messages) => {
    // todo
    console.log('Messages combined: ' + messages);
    return 'Combined messages';
}

module.exports.parseErrors = parseErrors;
module.exports.combineMessages = combineMessages;