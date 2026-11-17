
function edgesOf(points, closed) {
    const edges = [];
    for (let i = 0; i < points.length - 1; i++) {
        edges.push([points[i], points[i + 1]]);
    }
    if (closed && points.length > 2) {
        edges.push([points[points.length - 1], points[0]]);
    }
    return edges;
}

function pointBetween(a, b, t) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}


export function dashes(points, closed, dashLength, gapLength) {
    const result = [];
    let drawing = true;         
    let left = dashLength;     
    let current = [points[0]];   

    for (const [a, b] of edgesOf(points, closed)) {
        const length = Math.hypot(b.x - a.x, b.y - a.y);
        let travelled = 0;

       
        while (length - travelled > left) {
            travelled += left;
            const p = pointBetween(a, b, travelled / length);

            if (drawing) {
                current.push(p);
                result.push(current);
            } else {
                current = [p];
            }

            drawing = !drawing;
            left = drawing ? dashLength : gapLength;
        }

        left -= length - travelled;
        if (drawing) {
            current.push(b);
        }
    }

    if (drawing && current.length > 1) {
        result.push(current);
    }
    return result;
}

export function dots(points, closed, spacing) {
    const result = [];
    let untilNext = 0;  

    for (const [a, b] of edgesOf(points, closed)) {
        const length = Math.hypot(b.x - a.x, b.y - a.y);
        if (length === 0) {
            continue;
        }

        let travelled = untilNext;
        while (travelled <= length) {
            result.push(pointBetween(a, b, travelled / length));
            travelled += spacing;
        }
        untilNext = travelled - length;
    }

    if (closed && result.length > 1) {
        const first = result[0];
        const last = result[result.length - 1];
        if (Math.hypot(last.x - first.x, last.y - first.y) < spacing / 2) {
            result.pop();
        }
    }
    return result;
}


export function stripes(points, spacing) {
    const sum = (p) => p.x + p.y;
    const sums = points.map(sum);
    const lowest = Math.min(...sums);
    const highest = Math.max(...sums);


    const step = spacing * Math.SQRT2;
    const edges = edgesOf(points, true);
    const result = [];

    for (let c = lowest + step / 2; c < highest; c += step) {
        const crossings = [];

        for (const [a, b] of edges) {
            const sa = sum(a);
            const sb = sum(b);

           
            if ((sa <= c && c < sb) || (sb <= c && c < sa)) {
                crossings.push(pointBetween(a, b, (c - sa) / (sb - sa)));
            }
        }

        crossings.sort((p, q) => p.x - q.x);

        for (let i = 0; i + 1 < crossings.length; i += 2) {
            result.push([crossings[i], crossings[i + 1]]);
        }
    }
    return result;
}