export const registerFloorplanRoom = (mxUtils, mxCellRenderer, mxShape) => {
  function mxFloorplanRoom(bounds, fill, stroke, strokewidth)
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
  // mxUtils.extend(mxFloorplanRoom, mxShape);

  mxFloorplanRoom.prototype.cst = {
          ROOM : 'mxgraph.floorplan.room',
          WALL_THICKNESS : "wallThickness"
  };

  mxFloorplanRoom.prototype.customProperties = [
      {name:'wallThickness', dispName:'Thickness', type:'float', min:0, defVal:10}
  ];

  /**
  * Function: paintVertexShape
  * 
  * Paints the vertex shape.
  */
  mxFloorplanRoom.prototype.paintVertexShape = function(c, x, y, w, h)
  {
      c.translate(x, y);
      this.background(c, x, y, w, h);
  };

  mxFloorplanRoom.prototype.background = function(c, x, y, w, h)
  {
      var wallTh = parseFloat(mxUtils.getValue(this.style, mxFloorplanRoom.prototype.cst.WALL_THICKNESS, '10'));

      c.begin();
      c.moveTo(0, h);
      c.lineTo(0, 0);
      c.lineTo(w, 0);
      c.lineTo(w, h);
      c.close();
      c.moveTo(wallTh, wallTh);
      c.lineTo(wallTh, h - wallTh);
      c.lineTo(w - wallTh, h - wallTh);
      c.lineTo(w - wallTh, wallTh);
      c.close();
      c.fillAndStroke();
  };

  mxCellRenderer.registerShape(mxFloorplanRoom.prototype.cst.ROOM, mxFloorplanRoom);

}