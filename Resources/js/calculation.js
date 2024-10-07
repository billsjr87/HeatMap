onmessage = function (params) {
    this.self.postMessage(calculate(params.data[0], params.data[1], params.data[2], params.data[3]));
}

function calculate(trxArray, jtiProduct, squareFilter, categoryFilter) {
    // console.log(trxArray);
    // Category:"SPM"
    var result = new Array();
    trxArray.forEach(data => {
        var cat = lookup(jtiProduct, data['CategoryProduct'], 'KATEGORI PRODUK', 'Segment');
        data['Category'] = cat;
    });

    squareFilter.forEach(sqSegment => {
        categoryFilter.forEach(category => {
            for (let index = 1; index <= 5; index++) {
                var vol = 0;
                var ecCount = 0;
                var temp = trxArray.filter(data => data['Category'] == category && data['WeekNumber'] == index && data['SquareSegment'] == sqSegment);
                if (temp.length > 0) {
                    temp.forEach(dt => {
                        vol += dt['Volume'];
                        ecCount += dt['EffectiveCall'];
                    })
                }
                var dropSize = vol / ecCount;
                result.push({ 'WeekNumber': index, 'squareSegment': sqSegment, 'category': category, 'volume': vol, 'ec': ecCount, 'dz': dropSize });
            }
        });
    });
    
    return result;
}

function lookup(arr, id, src, target) {
    var result;
    arr.forEach((item) => {
        if (item[src] == id) {
            result = item[target];
        } else {
            return;
        }
    });
    return result;
}
