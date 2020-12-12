
export const registerFloorplanWallU = (mxUtils, mxCellRenderer, mxShape) => {
    
    function mxFloorplanWallU(bounds, fill, stroke, strokewidth)
    {
        mxShape.call(this);
        this.bounds = bounds;
        this.fill = fill;
        this.stroke = stroke;
        this.strokewidth = (strokewidth != null) ? strokewidth : 1;
    };
    
    mxUtils.extend(mxFloorplanWallU, mxShape);	
    
    mxFloorplanWallU.prototype.cst = {
        WALL_U : 'mxgraph.floorplan.wallU',
        WALL_THICKNESS : "wallThickness"
    };
    
    mxFloorplanWallU.prototype.customProperties = [
        {name:'wallThickness', dispName:'Thickness', type:'float', min:0, defVal:10}
    ];
    /**
     * Function: paintVertexShape
    * 
    * Paints the vertex shape.
    */
    mxFloorplanWallU.prototype.paintVertexShape = function(c, x, y, w, h)
    {
        c.translate(x, y);
        this.background(c, x, y, w, h);
    };
    /**
     * Extends mxShape.
	 */
    
    mxFloorplanWallU.prototype.background = function(c, x, y, w, h)
    {
        var wallTh = parseFloat(mxUtils.getValue(this.style, mxFloorplanWallU.prototype.cst.WALL_THICKNESS, '10'));
        
        c.begin();
        c.moveTo(0, h);
        c.lineTo(0, 0);
        c.lineTo(w, 0);
        c.lineTo(w, h);
        c.lineTo(w - wallTh, h);
        c.lineTo(w - wallTh, wallTh);
        c.lineTo(wallTh, wallTh);
        c.lineTo(wallTh, h);
        c.close();
        c.fillAndStroke();
    };
	mxCellRenderer.registerShape(mxFloorplanWallU.prototype.cst.WALL_U, mxFloorplanWallU);
}