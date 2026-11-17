// used to save/hold drawing style for shape... hopefully
class StyleManager {

    static FILL_TYPES = ["solid", "striped", "none"];
    static STROKE_TYPES = ["solid", "dashed", "dotted"];

    static style = {
        fillType: "solid",     
        fillColor: 0xff8800,
        fillAlpha: 1,          
        strokeType: "solid",   
        strokeColor: 0x000000,
        strokeWidth: 2,        
    };

    static current() {
        return { ...this.style };
    }

    static update(changes) {
        this.style = { ...this.style, ...changes };
    }

   
    static next(options, current) {
        return options[(options.indexOf(current) + 1) % options.length];
    }

    static toHex(color) {
        return "#" + color.toString(16).padStart(6, "0");
    }
}

export default StyleManager;