const fieldMap = {
    rankingTitle: 'ranking title',
    numerationType: 'numeration type',
    bookId: 'book ID',
    rankingId: 'ranking ID',
    recordPosition: 'record position'
}

const parseErrors = (errors) => {
    const messageArray = [];
    for (const error of errors) {
        const fieldName = fieldMap[error.path] || error.path;
        const message = error.msg;
        messageArray.push(`${fieldName}: ${message}`);
    }

    return messageArray.join('\n');
};

const combineMessages = (messages) => {
    // todo
    console.log('Messages combined: ' + messages);
    return 'Combined messages';
}

module.exports.parseErrors = parseErrors;
module.exports.combineMessages = combineMessages;