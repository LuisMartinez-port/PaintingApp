import Draw from "./Draw.js";


class PolygonDraw extends Draw {

    points = [];

    outline() {
        const { x, y, width, height } = this.bounds();

        const corners = this.points.map(([px, py]) => ({
            x: x + px * width,
            y: y + py * height,
        }));

        return { points: corners, closed: true };
    }
}

function regularPolygon(sides) {
    const raw = [];
    for (let i = 0; i < sides; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
        raw.push([Math.cos(angle), Math.sin(angle)]);
    }

    const xs = raw.map(([px]) => px);
    const ys = raw.map(([, py]) => py);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);

    return raw.map(([px, py]) => [
        (px - minX) / (maxX - minX),
        (py - minY) / (maxY - minY),
    ]);
}

export class TriangleDraw extends PolygonDraw {
    points = [[0.5, 0], [1, 1], [0, 1]];
}

export class DiamondDraw extends PolygonDraw {
    points = [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]];
}

export class PentagonDraw extends PolygonDraw {
    points = regularPolygon(5);
}

export class HexagonDraw extends PolygonDraw {
    points = regularPolygon(6);
}

export class ArrowDraw extends PolygonDraw {
    points = [
        [0, 0.3], [0.6, 0.3], [0.6, 0], 
        [1, 0.5],                          
        [0.6, 1], [0.6, 0.7], [0, 0.7],   
    ];
}

export default PolygonDraw;