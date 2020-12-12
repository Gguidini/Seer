export const registerFloorplanWall = (mxUtils, mxCellRenderer, mxShape) => {
    function mxFloorplanWall(bounds, fill, stroke, strokewidth)
    {
        mxShape.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = (strokewidth != null) ? strokewidth : 1;
    };

    /**
    * Extends mxShape.
    */
    mxUtils.extend(mxFloorplanWall, mxShape);

    mxFloorplanWall.prototype.cst = {
            WALL : 'mxgraph.floorplan.wall',
            WALL_THICKNESS : "wallThickness"
    };

    mxFloorplanWall.prototype.customProperties = [
        {name:'wallThickness', dispName:'Thickness', type:'float', min:0, defVal:10}
    ];

    /**
    * Function: paintVertexShape
    * 
    * Paints the vertex shape.
    */
    mxFloorplanWall.prototype.paintVertexShape = function(c, x, y, w, h)
    {
        c.translate(x, y);
        this.background(c, x, y, w, h);
    };

    mxFloorplanWall.prototype.background = function(c, x, y, w, h)
    {
        var wallTh = parseFloat(mxUtils.getValue(this.style, mxFloorplanWall.prototype.cst.WALL_THICKNESS, '10'));
        c.rect(0, h * 0.5 - wallTh * 0.5, w, wallTh);
        c.fillAndStroke();
    };

    mxCellRenderer.registerShape(mxFloorplanWall.prototype.cst.WALL, mxFloorplanWall);

}