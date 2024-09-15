onmessage = function (params) {
    console.log('Worker Start');
    const result = params.data * 3;
    postMessage(result);
}