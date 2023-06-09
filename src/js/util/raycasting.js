function castRay(x, y, angle, maxDistance) {
    const castHorizontal = castAgainstHorizontal(x, y, angle, maxDistance);
    const castVertical = castAgainstVertical(x, y, angle, maxDistance);

    let cast;
    if (!castHorizontal) {
        cast = castVertical;
    } else if(!castVertical) {
        cast = castHorizontal;
    } else {
        var dHorizontal = distP(x, y, castHorizontal.x, castHorizontal.y);
        var dVertical = distP(x, y, castVertical.x, castVertical.y);
        cast = dHorizontal < dVertical ? castHorizontal : castVertical;
    }

    if (distP(x, y, cast.x, cast.y) > maxDistance) {
        cast = {'x': x + cos(angle) * maxDistance, 'y': y + sin(angle) * maxDistance};
    }

    return cast;
}

function castAgainstHorizontal(startX, startY, angle, maxDistance){
    var pointingDown = sin(angle) > 0;

    var y = ~~(startY / BLOCK_SIZE) * BLOCK_SIZE + (pointingDown ? BLOCK_SIZE : -0.0001);
    var x = startX + (y - startY) / tan(angle);

    var yStep = pointingDown ? BLOCK_SIZE : -BLOCK_SIZE;
    var xStep = yStep / tan(angle);

    return doCast(x, y, xStep, yStep, 1, maxDistance);
}

function castAgainstVertical(startX, startY, angle, maxDistance){
    var pointingRight = cos(angle) > 0;

    var x = ~~(startX / BLOCK_SIZE) * BLOCK_SIZE + (pointingRight ? BLOCK_SIZE : -0.0001);
    var y = startY + (x - startX) * tan(angle);

    var xStep = pointingRight ? BLOCK_SIZE : -BLOCK_SIZE;
    var yStep = xStep * tan(angle);

    return doCast(x, y, xStep, yStep, 0, maxDistance);
}

function doCast(startX, startY, xStep, yStep, castType, maxDistance) {
    let x = startX,
        y = startY;

    for (let i = 0 ; distP(x, y, startX, startY) < maxDistance ; i++) {
        G.castIterations++;
        if (internalHasBlock(x, y)) {
            // Got a block!
            const blockId = ~~(x / BLOCK_SIZE) + ~~(y / BLOCK_SIZE) * W.matrix.length;
            return {
                'x': x,
                'y': y,
                'castType': castType + '-' + blockId,
                'blockId': blockId
            };
        } else if(isOut(x, y)) {
            // Out of bounds
            break;
        } else {
            x += xStep;
            y += yStep;
        }
    }

    return {
        'x': x,
        'y': y,
        'castType': ''
    };
}

function hasBlock(x, y, radius = 0) {
    return internalHasBlock(x, y) ||
        internalHasBlock(x + radius, y) ||
        internalHasBlock(x - radius, y) ||
        internalHasBlock(x, y - radius) ||
        internalHasBlock(x, y + radius);
}

function internalHasBlock(x, y) {
    if (isOut(x, y)) {
        return false;
    }

    const row = ~~(y / BLOCK_SIZE);
    const col = ~~(x / BLOCK_SIZE);

    return W.matrix[row][col];
}

function isOut(x, y) {
    return !between(0, x, W.matrix[0].length * BLOCK_SIZE) ||
        !between(0, y, W.matrix.length * BLOCK_SIZE);
}
